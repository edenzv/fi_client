import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../_services';
import { ChecklistDatabaseService, TodoItemFlatNode, TodoItemNode } from '../checklist-database.service';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss'],
  providers: [ChecklistDatabaseService]
})
export class UserPageComponent {

  selectedNode: TodoItemFlatNode;

  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<TodoItemFlatNode, TodoItemNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<TodoItemNode, TodoItemFlatNode>();

  /** A selected parent node to be inserted */
  selectedParent: TodoItemFlatNode | null = null;

  /** The new item's name */
  newItemName = '';

  treeControl: FlatTreeControl<TodoItemFlatNode>;

  treeFlattener: MatTreeFlattener<TodoItemNode, TodoItemFlatNode>;

  dataSource: MatTreeFlatDataSource<TodoItemNode, TodoItemFlatNode>;

  /** The selection for checklist */
  checklistSelection = new SelectionModel<TodoItemFlatNode>(true /* multiple */);

  constructor(private database: ChecklistDatabaseService,
              private route: ActivatedRoute,
              private router: Router) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
      this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    database.dataChange.subscribe(data => {
      this.dataSource.data = data;
    });
  }

  getLevel = (node: TodoItemFlatNode) => node.level;

  isExpandable = (node: TodoItemFlatNode) => node.expandable;

  getChildren = (node: TodoItemNode): TodoItemNode[] => node.children;

  hasChild = (_: number, nodeData: TodoItemFlatNode) => nodeData.expandable;

  hasNoContent = (_: number, nodeData: TodoItemFlatNode) => nodeData.item === '';

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: TodoItemNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode && existingNode.item === node.item
                     ? existingNode
                     : new TodoItemFlatNode();
    flatNode.id = node.id;
    flatNode.description = node.description;
    flatNode.item = node.item;
    flatNode.level = level;
    flatNode.expandable = !!node.children;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  }

  itemSelectionToggle(node: TodoItemFlatNode): void {
    if (this.selectedNode) {
      if (this.selectedNode.item !== node.item) {
        this.checklistSelection.toggle(this.selectedNode);
      }
      this.selectedNode = undefined;
    }
    this.checklistSelection.toggle(node);
    if (this.checklistSelection.isSelected(node)) {
      this.selectedNode = node;
    }

    if (node.level === 3) {
      const currentNode = this.flatNodeMap.get(node);
      this.router.navigate(['flows', currentNode.id]);
    }
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: TodoItemFlatNode): void {
    let parent: TodoItemFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: TodoItemFlatNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  /* Get the parent node of a node */
  getParentNode(node: TodoItemFlatNode): TodoItemFlatNode | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  deleteNode() {
    const node = this.selectedNode;
    const flatNode = this.flatNodeMap.get(node);
    const flatParentNode = this.getParentNode(node);
    const parentNode = this.flatNodeMap.get(flatParentNode);
    this.database.deleteItem(parentNode!, node.item, flatNode, node.level);
  }

  /** Select the category so we can insert the new item. */
  addNewItem(node: TodoItemFlatNode) {
    const parentNode = this.flatNodeMap.get(node);
    this.database.insertItem(parentNode!, '', node.level < 2);
    this.treeControl.expand(node);
  }

  cancelNewItem(node: TodoItemFlatNode) {
    const flatParentNode = this.getParentNode(node);
    const parentNode = this.flatNodeMap.get(flatParentNode);
    this.database.deleteItem(parentNode!, '');
  }

  /** Save the node to database */
  saveNode(node: TodoItemFlatNode, projName: string, itemDescription: string) {
    const nestedNode = this.flatNodeMap.get(node);
    const flatParentNode = this.getParentNode(node);
    const parentNode = this.flatNodeMap.get(flatParentNode);
    this.database.updateItem(nestedNode!, projName, itemDescription, node.level, parentNode.id);
  }
}
