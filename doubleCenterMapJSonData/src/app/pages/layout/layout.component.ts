import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  constructor(
    private router: Router
  ) {  }
  showSearchPop = false;
  searchWord = '';
  ngOnInit() {
  }
  search () {
    if (this.searchWord.trim()) {
      this.showSearchPop = false;
      this.router.navigate(['/search/list', this.searchWord]);
      this.searchWord = '';
    }
  }

}
