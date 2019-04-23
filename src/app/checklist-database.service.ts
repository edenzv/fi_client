import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { INd, INdParent, ITre, TresService } from './tres.service';

/**
 * Node for to-do item
 */
export class TodoItemNode {
  id?: string;
  children?: TodoItemNode[];
  item: string;
  description?: string;
  data?: any;
}

/** Flat to-do item node with expandable and level information */
export class TodoItemFlatNode {
  id?: string;
  description?: string;
  data: any;
  item: string;
  level: number;
  expandable: boolean;
  editMode: boolean;
}

/**
 * The Json object for to-do list data.
 */
const TREE_DATA = {
  Groceries: {
    'Almond Meal flour': null,
    'Organic eggs': null,
    'Protein Powder': null,
    Fruits: {
      Apple: null,
      Berries: ['Blueberry', 'Raspberry'],
      Orange: null
    }
  },
  Reminders: [
    'Cook dinner',
    'Read the Material Design spec',
    'Upgrade Application to Angular'
  ]
};

@Injectable({
  providedIn: 'root'
})
export class ChecklistDatabaseService {
  dataChange = new BehaviorSubject<TodoItemNode[]>([]);

  get data(): TodoItemNode[] { return this.dataChange.value; }

  constructor(private tresService: TresService) {
    this.initialize();
  }

  initialize() {

    this.tresService.getTres()
      .subscribe(
        (result) => {
          const treeData: { [key: string]: any } = {
            Projects: {
              children: {}
            }
          };
          result.forEach((tre) => {
            const mainParentChildren = treeData.Projects.children;
            const treKey = `${tre.lbl}`;
            mainParentChildren[treKey] = {
              id: tre.ID,
              children: {},
              description: tre.des,
              data: tre
            };
            tre.ndParents.forEach(ndParent => {
              const ndParentKey = `${ndParent.lbl}`;
              mainParentChildren[treKey].children[ndParentKey] = {
                id: ndParent.ID,
                description: ndParent.des,
                children: {},
                data: ndParent
              };
              ndParent.ND.forEach(nd => {
                const ndKey = `${nd.lbl}`;
                mainParentChildren[treKey].children[ndParentKey].children[ndKey] = {
                  id: nd.ID,
                  description: nd.des,
                  data: nd
                };
              });
            });
          });

          // Build the tree nodes from Json object. The result is a list of `TodoItemNode` with nested
          //     file node as children.
          const data = this.buildFileTree(treeData, 0);

          // Notify the change.
          this.dataChange.next(data);
        },
        (error) => {
          console.error(error);
        });
  }

  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `TodoItemNode`.
   */
  buildFileTree(obj: { [key: string]: any }, level: number): TodoItemNode[] {
    return Object.keys(obj).reduce<TodoItemNode[]>((accumulator, key) => {
      const value = obj[key];
      const children = value.children;
      const node = new TodoItemNode();
      node.item = key;
      node.id = value.id;
      node.description = value.description;
      node.data = value.data;

      if (children != null) {
        if (typeof children === 'object') {
          node.children = this.buildFileTree(children, level + 1);
        } else {
          node.item = children;
        }
      }

      return accumulator.concat(node);
    }, []);
  }

  /** Add an item to to-do list */
  insertItem(parent: TodoItemNode, name: string, withChildren: boolean) {
    if (parent.children) {
      const newItem: TodoItemNode = { item: name };
      if (withChildren) {
        newItem.children = [];
      }
      parent.children.push(newItem);
      this.dataChange.next(this.data);
    }
  }

  deleteItem(parent: TodoItemNode, name: string, node?: TodoItemNode, level?: number): Observable<any> {
    if (name !== '' && node !== undefined && level !== undefined && node.id !== undefined) {
      if (level === 1) {
        return this.tresService.deleteTre(node.id);
      } else if (level === 2) {
        return this.tresService.deleteNdParent(node.id);
      } else if (level === 3) {
        return this.tresService.deleteNd(node.id);
      }
    } else {
      parent.children = parent.children.filter(p => p.item !== name);
      this.dataChange.next(this.data);
    }
  }

  deleteItemFromList(parentNode: any, node: TodoItemNode) {
    const index = parentNode.children.indexOf(node);
    if (index !== -1) {
      parentNode.children.splice(index, 1);
      this.dataChange.next(this.data);
    }
  }

  addItem(node: TodoItemNode, name: string, description: string, level: number, parentId?: string) {
    node.item = name;
    if (level === 1) {
      this.tresService.addTre(name, description).subscribe(
        (tre: ITre) => {
          node.id = tre.ID;
          node.description = tre.des;
          node.data = tre;
          this.dataChange.next(this.data);
        },
        error => {
          console.error(error);
        });
    } else if (level === 2) {
      this.tresService.addNdParent(parentId, name, description).subscribe(
        (ndParent: INdParent) => {
          node.id = ndParent.ID;
          node.description = ndParent.des;
          node.data = ndParent;
          this.dataChange.next(this.data);
        },
        error => {
          console.error(error);
        });
    } else if (level === 3) {
      this.tresService.addNd(parentId, name, description).subscribe(
        (nd: INd) => {
          node.id = nd.ID;
          node.description = nd.des;
          node.data = nd;
          this.dataChange.next(this.data);
        },
        error => {
          console.error(error);
        });
    }

  }

  updateItem(node: TodoItemNode, level: number) {
    node.item = name;
    const copyNodeData = JSON.parse(JSON.stringify(node.data));
    if (level === 1) {
      copyNodeData.ndParents = undefined;
      return this.tresService.updateTre(node.id, copyNodeData);
    } else if (level === 2) {
      copyNodeData.ND = undefined;
      return this.tresService.updateNdParent(node.id, copyNodeData);
    } else if (level === 3) {
      copyNodeData.FI = undefined;
      return this.tresService.updateNd(node.id, copyNodeData);
    }
  }
}
