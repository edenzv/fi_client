import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { INd, INdParent, ITre, TresService } from './tres.service';

/**
 * Node for to-do item
 */
export class TodoItemNode {
  id?: string;
  children?: TodoItemNode[];
  item: string;
}

/** Flat to-do item node with expandable and level information */
export class TodoItemFlatNode {
  item: string;
  level: number;
  expandable: boolean;
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
            const treKey = `${tre.lbl}: ${tre.des}`;
            mainParentChildren[treKey] = {
              id: tre.ID,
              children: {}
            };
            tre.ndParents.forEach(ndParent => {
              const ndParentKey = `${ndParent.lbl}: ${ndParent.des}`;
              mainParentChildren[treKey].children[ndParentKey] = {
                id: ndParent.ID,
                children: {}
              };
              ndParent.ND.forEach(nd => {
                const ndKey = `${nd.lbl}: ${nd.des}`;
                mainParentChildren[treKey].children[ndParentKey].children[ndKey] = {
                  id: nd.ID
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

  updateItem(node: TodoItemNode, name: string, level: number, parentId?: string) {
    node.item = name;
    if (level === 1) {
      this.tresService.addTre(name).subscribe(
        (tre: ITre) => {
          node.id = tre.ID;
          this.dataChange.next(this.data);
        },
        error => {
          console.error(error);
        });
    } else if (level === 2) {
      this.tresService.addNdParent(parentId, name).subscribe(
        (ndParent: INdParent) => {
          node.id = ndParent.ID;
          this.dataChange.next(this.data);
        },
        error => {
          console.error(error);
        });
    } else if (level === 3) {
      this.tresService.addNd(parentId, name).subscribe(
        (nd: INd) => {
          node.id = nd.ID;
          this.dataChange.next(this.data);
        },
        error => {
          console.error(error);
        });
    }

  }
}
