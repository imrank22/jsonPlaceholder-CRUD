import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Post } from 'src/app/interfaces/posts.interface';
import { Comment } from 'src/app/interfaces/comment.interface';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-detail-post',
  templateUrl: './detail-post.component.html',
  styleUrls: ['./detail-post.component.scss']
})
export class DetailPostComponent implements OnInit {

  postId: number = 0
  postDetail: Post = {
    id: 0,
    body: '',
    title: '',
    userId: 0
  }
  
  constructor( private post: CommonService, private route: ActivatedRoute ) { 
    route.params.subscribe(params => this.postId = params['id'])
  }

  ngOnInit(): void {
    this.fetchPostDetails()
  }

  fetchPostDetails(){
    this.post.getPost$(this.postId).subscribe((data: Post)=> this.postDetail = data)
  }

}
