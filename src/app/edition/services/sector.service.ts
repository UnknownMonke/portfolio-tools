import { Injectable } from '@angular/core';
import { MessageService, TreeNode } from 'primeng/api';
import { BehaviorSubject, Observable, map, of, switchMap } from 'rxjs';
import { Sector } from '../../common/models/sector';
import { SectorApiService } from './sector.provider';

@Injectable({
  providedIn: 'root'
})
export class SectorService {

  private _sectorDataSubject: BehaviorSubject<TreeNode<Sector>[]> = new BehaviorSubject<TreeNode<Sector>[]>([]);

  sectorData$: Observable<TreeNode<Sector>[]>;

  sectorListSubject: BehaviorSubject<Sector[]> = new BehaviorSubject<Sector[]>([]);

  constructor(
    private _messageService: MessageService,
    private _sectorApiService: SectorApiService
  ) {
    this.sectorData$ = this._sectorDataSubject.asObservable()
      .pipe(
        switchMap(list => list !== null && list.length > 0 ? of(list) : this.get()),
      )
  }

  get(): Observable<TreeNode<Sector>[]> {
    return this._sectorApiService.get()
      .pipe(
        map( (data: Sector[]) => {
          const nodes: TreeNode<Sector>[] = this.generateNodeList(this._sectorDataSubject.value, data);
          this._sectorDataSubject.next(nodes);
          return nodes;
        })
      );
  }

  /** Expands or collapses the tree by changing the 'expanded' attribute recursively. */
  expand(isExpand: boolean) {
    const sectorData = this._sectorDataSubject.value;

    sectorData.forEach(node => {
      this.expandRecursive(node, isExpand);
    });
    this._sectorDataSubject.next([...sectorData]); // Uses the spread operator to trigger a refresh of the table with sorts and filters.
  }

  private expandRecursive(node: TreeNode, isExpand: boolean){
    node.expanded = isExpand;

    if(node.children){
      node.children.forEach(childNode => {
        this.expandRecursive(childNode, isExpand);
      });
    }
  }

  /** Converts the DTO array into an array of TreeNode as per PrimeNG TreeTable component requirements (see doc). */
  private generateNodeList(previousSectorData: TreeNode<Sector>[], sectorList: Sector[]): TreeNode<Sector>[] {
    const treeNodeData: TreeNode<Sector>[] = [];

    sectorList
      .filter(sector => sector.level === 0)
      .forEach(sector => {
        // Searches for the current stored main node to maintain the expanded status if exists.
        const existingNode = this.findNode(previousSectorData, sector._id);

        treeNodeData.push(
          {
            data: sector,
            expanded: existingNode ? existingNode.expanded : true,
            children: []
          }
        );
      });

    treeNodeData.forEach(node =>
      sectorList
        .filter(sector => sector.parentId === node.data?._id)
        .forEach(subsector => {
          // Searches for the current stored sub node to maintain the expanded status if exists, by finding the main node first and searching tthe children.
          const existingNode = this.findNode(previousSectorData, subsector.parentId);
          const existingSubNode = existingNode ? existingNode.children?.filter(subNode => subNode.data?._id === subsector._id) : null;

          node.children?.push(
            {
              data: subsector,
              expanded: existingSubNode && existingSubNode.length > 0 ? existingSubNode[0].expanded : true
            }
          );
        })
    );
    return treeNodeData;
  }

  /**
   * Finds a node in the tree.
   */
  private findNode(sectorData: TreeNode<Sector>[], nodeId: number): TreeNode<Sector> | null {
    const filter = sectorData.filter(node => node.data?._id === nodeId);

    return filter && filter.length > 0 ? filter[0] : null;
  }

  /**
   * Adds a new sector linked to its parent if exists (top level Sector does not have any).
   *
   * Upon requests success, the new Sector DTO is returned (with the id) and added to the DTO list.
   *
   * @param parent the parent node of the new Sector. Can be undefined if the Sector is at the top level.
   */
  add(name: string, parent?: Sector): Observable<void> {

    if(!!name) {

      // Not a Sector DTO object as id is generated server-side.
      const newSector: Partial<Sector> = {
        name,
        level: parent ? parent.level + 1 : 0, // If parent exists, makes it children by increasing the level.
        parentId: parent ? parent._id : -1 // Refers parent id to be able to link afterward.
      };

      return this._sectorApiService.add(newSector)
        .pipe(
          map( (data: Sector) => {
            // Updates DTO list and regenerates the TreeNode object, which is served to the PrimeNG Table.
            let sectorList: Sector[] = this.sectorListSubject.value;

            this.sectorListSubject.next([...sectorList, data]);

            // Choice is made to regenerate each time rather than editing the TreeNode object itself.

            // Displays toast popup to confirm action success.
            this._messageService.add({ key: 'main', severity: 'success', summary: '', detail: 'Element successfully added' });
          })
        );
    }
    throw new Error('Name is not defined');
  }

  /**
   * Edits an existing Sector name.
   *
   * @param sector selected Sector, always defined but type checked nonetheless.
   */
  edit(sector: Sector): Observable<void> {

    if(!!sector?.name) {

      // Clones the parameter to avoid updating it in the table before request success, as it's an underlying component property.

      return this._sectorApiService.edit(sector)
        .pipe(
          map( (success: boolean) => {
            if(success) {
              // Updates DTO list and regenerates the TreeNode object, which is served to the PrimeNG Table.
              let sectorList: Sector[] = this.sectorListSubject.value;

              sectorList.filter(sec => sec._id === sector._id)[0].name = sector.name;

              this.sectorListSubject.next([...sectorList]);

              this._messageService.add({ key: 'main', severity: 'success', summary: '', detail: 'Element successfully edited' });
            }
          })
        );
    }
    throw new Error('Name is not defined');
  }

  delete(id: number): Observable<void> {

    return this._sectorApiService.delete(id)
      .pipe(
        map( (success: boolean) => {
          if(success) {
            /*
            Updates DTO list and regenerates the TreeNode object, which is served to the PrimeNG Table.
            The targeted Sector and all its sub Sectors are removed to keep the DTO list clean despite removing sub Sector not being
            necessary as regenerating the tree will automatically ignore orphan Sectors.
            */

            let sectorList: Sector[] = this.sectorListSubject.value;


            sectorList = sectorList.filter(sector => sector._id !== id && sector.parentId !== id);

            this.sectorListSubject.next([...sectorList]);

            this._messageService.add({ key: 'main', severity: 'success', summary: '', detail: 'Element successfully deleted' });
          }
        })
      );

  }
}
