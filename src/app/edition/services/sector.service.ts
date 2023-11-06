import { Injectable } from '@angular/core';
import { MessageService, TreeNode } from 'primeng/api';
import { BehaviorSubject, Observable, map, of, switchMap, take } from 'rxjs';
import { Sector } from '../../common/models/sector';
import { SectorProvider } from './sector.provider';

/**
 * Structure :
 *
 * The tree is regenerated entirely each time the Sector list is updated, after additon, edition and deletion.
 *
 * This is done to avoid lengthy code to update the tree structure in place each time a node changes.
 * We then update an intermediate variable to store the updated list, then regenerate from this list.
 */
@Injectable({
  providedIn: 'root'
})
export class SectorService {

  //TODO persistence on nav for expanded state
  private _treeSubject: BehaviorSubject<TreeNode<Sector>[]> = new BehaviorSubject<TreeNode<Sector>[]>([]);

  constructor(
    private _messageService: MessageService,
    private _sectorProvider: SectorProvider
  ) {}

  sectorData$(): Observable<TreeNode<Sector>[]> {
    return this._treeSubject.asObservable()
      .pipe(
        switchMap( (list: TreeNode<Sector>[]) =>
          list !== null && list.length > 0
          ? of(list)
          : this._sectorProvider.get()
            .pipe(
              map( (list: Sector[]) => this._generateTree(list))
            )
        )
      );
  }

  /** Expands or collapses a clicked node in the tree by changing its 'expanded' attribute. */
  onExpandChange(node: TreeNode<Sector>) {
    let sectorTree: TreeNode<Sector>[] = this._treeSubject.value;
    const sector = node.data;

    if(sector?.level === 0) {
      const find = sectorTree.filter(n => n.data?._id === sector._id)[0];
      find.expanded = node.expanded;
    } else {
      const parent = sectorTree.filter(n => n.data?._id === sector?.parentId)[0];
      const find = parent.children?.filter(n => n.data?._id === sector?._id)[0];
      if(find) find.expanded = node.expanded;
    }
    this._treeSubject.next([...sectorTree]);
  }

  /** Expands or collapses the entire tree by changing the 'expanded' attribute recursively. */
  expand(isExpand: boolean) {
    const sectorData = this._treeSubject.value; // TODO chain obsservables

    sectorData.forEach(node => {
      this._expandRecursive(node, isExpand);
    });
    this._treeSubject.next([...sectorData]); // Uses the spread operator to trigger a refresh of the table with sorts and filters.
  }

  private _expandRecursive(node: TreeNode, isExpand: boolean){
    node.expanded = isExpand;

    if(node.children){
      node.children.forEach(childNode => {
        this._expandRecursive(childNode, isExpand);
      });
    }
  }

  /** Converts the DTO array into an array of TreeNode as per PrimeNG TreeTable component requirements (see doc). */
  private _generateTree(sectorList: Sector[]): TreeNode<Sector>[] {
    const sectorTree: TreeNode<Sector>[] = [];
    const previousSectorTree: TreeNode<Sector>[] = this._treeSubject.value;

    sectorList
      .filter(sector => sector.level === 0)
      .forEach(sector => {
        // Searches for the current stored main node to maintain the expanded status if exists.
        const existingNode = this._findNode(previousSectorTree, sector._id);

        sectorTree.push(
          {
            data: sector,
            expanded: existingNode ? existingNode.expanded : true,
            children: []
          }
        );
      });

      sectorTree.forEach(node =>
        sectorList
          .filter(sector => sector.parentId === node.data?._id)
          .forEach(subsector => {
            // Searches for the current stored sub node to maintain the expanded status if exists, by finding the main node first and searching tthe children.
            const existingNode = this._findNode(previousSectorTree, subsector.parentId);
            const existingSubNode = existingNode ? existingNode.children?.filter(subNode => subNode.data?._id === subsector._id) : null;

            node.children?.push(
              {
                data: subsector,
                expanded: existingSubNode && existingSubNode.length > 0 ? existingSubNode[0].expanded : true
              }
            );
          })
    );
    this._treeSubject.next(sectorTree);
    return sectorTree;
  }

  /**
   * Finds a top level node in the tree.
   */
  private _findNode(sectorTree: TreeNode<Sector>[], id: number): TreeNode<Sector> | null {
    const filter = sectorTree.filter(node => node.data?._id === id);

    return filter && filter.length > 0 ? filter[0] : null;
  }

  /**
   * Adds a new sector linked to its parent if exists (top level Sector does not have any).
   * Upon requests success, the new Sector is returned (with the id) and added to the list.
   *
   * @param parent the parent node of the new Sector. Can be undefined if the Sector is at the top level.
   */
  add(name: string, parent?: Sector): void {
    if(!!name) {
      // Not a Sector DTO object as id is generated server-side.
      const newSector: Partial<Sector> = {
        name,
        level: parent ? parent.level + 1 : 0, // If parent exists, makes it children by increasing the level.
        parentId: parent ? parent._id : -1 // Refers parent id to be able to link afterward.
      };

      this._sectorProvider.add(newSector)
        .pipe(
          take(1),
          map( (data: Sector) => {
            let sectorTree: TreeNode<Sector>[] = this._treeSubject.value;
            const newNode: TreeNode<Sector> = { data, expanded: true };

            if(data.level === 0) {
              sectorTree.push(newNode);

            } else {
              const parent = sectorTree.filter(node => node.data?._id === data.parentId)[0];

              parent.children ? parent.children?.push(newNode) : parent.children = [newNode];
              parent.expanded = true;
            }
            this._treeSubject.next([...sectorTree]);

            // Displays toast popup to confirm action success.
            this._messageService.add({ key: 'main', severity: 'success', summary: '', detail: 'Element successfully added' });
          })
        ).subscribe();

    } else {
      throw new Error('Name is not defined');
    }
  }

  /**
   * Edits an existing Sector name.
   *
   * @param sector selected Sector, always defined but type checked nonetheless.
   */
  edit(sector: Sector): void {
    if(!!sector?.name) {

      this._sectorProvider.edit(sector)
        .pipe(
          take(1),
          map( (success: boolean) => {
            if(success) {
              let sectorTree: TreeNode<Sector>[] = this._treeSubject.value;

              if(sector.level === 0) {
                let node = sectorTree.filter(node => node.data?._id === sector._id)[0];
                if(node.data) node.data.name = sector.name; // Always present.
                node = {...node};

              } else {
                const parent = sectorTree.filter(node => node.data?._id === sector.parentId)[0];
                let node = parent.children?.filter(node => node.data?._id === sector._id)[0];
                if(node && node.data) node.data.name = sector.name; // Always present.
                node = {...node};
              }
              this._treeSubject.next([...sectorTree]);

              this._messageService.add({ key: 'main', severity: 'success', summary: '', detail: 'Element successfully edited' });
            }
          })
        ).subscribe();

    } else {
      throw new Error('Name is not defined');
    }
  }

  delete(sector: Sector): void {

    this._sectorProvider.delete(sector._id)
      .pipe(
        take(1),
        map( (success: boolean) => {
          if(success) {
            /*
            Updates DTO list and regenerates the TreeNode object, which is served to the PrimeNG Table.
            The targeted Sector and all its sub Sectors are removed to keep the DTO list clean despite removing sub Sector not being
            necessary as regenerating the tree will automatically ignore orphan Sectors.
            */
            let sectorTree: TreeNode<Sector>[] = this._treeSubject.value;

            if(sector.level === 0) {
              const node = sectorTree.filter(node => node.data?._id === sector._id)[0];
              const index = sectorTree.indexOf(node);
              sectorTree.splice(index, 1);

            } else {
              let parent = sectorTree.filter(node => node.data?._id === sector.parentId)[0];
              let node = parent.children?.filter(node => node.data?._id === sector._id)[0];
              if(node) {
                const index = parent.children?.indexOf(node);
                if(index !== undefined && index !== -1) parent.children?.splice(index, 1);
              }
            }
            this._treeSubject.next([...sectorTree]);

            this._messageService.add({ key: 'main', severity: 'success', summary: '', detail: 'Element successfully deleted' });
          }
        })
      ).subscribe();
  }
}
