import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';


/** L'arbre a 2 niveaux : secteurs et sous-secteurs */
@Component({
  selector: 'app-sector-mapping',
  templateUrl: './sector-mapping.component.html',
  styleUrls: ['./sector-mapping.component.scss']
})
export class SectorMappingComponent implements OnInit {

  //TODO dégradé de couleur automatique à l'affichage ou enregistré auto
  sectorData: TreeNode[] = [
    {
      label: "Technology",
      styleClass: "text-blue-900",
      children:
      [
        {
          label: "IT & Services",
          styleClass: "text-blue-700"
        },
        {
          label: "Video Games",
          styleClass: "text-blue-600"
        },
        {
          label: "Hardware & Periphericals",
          styleClass: "text-blue-500"
        }
      ]
    },
    {
      label: "Real Estate",
      styleClass: "text-yellow-700",
      children: []
    },
    {
      label: "Industrial",
      styleClass: "text-pink-900",
      children:
      [
        {
          label: "Automotive",
          styleClass: "text-pink-700"
        },
        {
          label: "Contruction & Engineering",
          styleClass: "text-pink-600"
        }
      ]
    },
    {
      label: "Healthcare",
      styleClass: "text-green-600",
      children:
      [
        {
          label: "Biotechnology",
          styleClass: "text-green-400"
        },
        {
          label: "Cannabis",
          styleClass: "text-green-300"
        }
      ]
    }
  ];

  constructor() {}

  ngOnInit(): void {
    this.expandAll();

  }

  expandAll(){
    this.sectorData.forEach(node => {
        this.expandRecursive(node, true);
    });
  }

  collapseAll(){
    this.sectorData.forEach(node => {
        this.expandRecursive(node, false);
    });
  }

  private expandRecursive(node: TreeNode, isExpand: boolean){
    node.expanded = isExpand; // Attribut html

    if (node.children){
      node.children.forEach(childNode => {
          this.expandRecursive(childNode, isExpand);
      });
    }
  }
}
