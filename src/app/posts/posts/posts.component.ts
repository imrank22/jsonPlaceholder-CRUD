import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Post } from 'src/app/interfaces/posts.interface';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {

  posts: Post[] = []
  search: string = ''
  isUpdating: boolean = false
  selectedPostId: number = 0
  isSortingAsc: boolean = true
  addPost = this._fb.group({
    title: [ '', [ Validators.required, Validators.pattern(/^[a-zA-Z0-9 ]*$/), Validators.minLength(5), Validators.maxLength(30) ] ],
    body: [ '', [ Validators.required, Validators.pattern(/^[a-zA-Z0-9 ]*$/), Validators.minLength(10), Validators.maxLength(100) ] ],
    userId: [ '', [ Validators.required, Validators.pattern(/^[0-9]*$/) ] ],
  })

  constructor( private postService: CommonService, private _fb: FormBuilder, private _snackbar: MatSnackBar ) { }

  ngOnInit(): void {
    this.fetchPosts()
  }

  get userId(){ return this.addPost.get('userId') }
  get title(){ return this.addPost.get('title') }
  get body(){ return this.addPost.get('body') }

  fetchPosts(){
    this.postService.getListOfPosts$().subscribe((data: Post[])=>{
      this.posts = data.splice(0, 4)
      this.posts.map(post =>{

        //fetching number of comments for each post
        this.postService.getCommentsForPost$(post.id).subscribe(res=>{
          post.commentLength = res.length
        })
        return post
      })
      console.log(this.posts)
    })
  }

  handleDelete(postId: number){
    this.posts = this.posts.filter(post => post.id !== postId)
  }

  handleSearch(){
    this.postService.getListOfPosts$().subscribe((data: Post[])=> this.posts = data.splice(0,4).filter(post => post.title.includes(this.search.toLowerCase())))
  }

  handleSort(){
    this.isSortingAsc = !this.isSortingAsc
    this.posts.reverse()
  }

  handleUpdate(post: Post){
    this.isUpdating = true
    this.selectedPostId = post.id
    this.addPost.patchValue({
      title: post.title,
      body: post.body,
      userId: post.userId
    })
  }

  resetUpdate(){
    this.isUpdating = false
    this.addPost.reset()
  }

  handleAddPost(){
    let payload = {
      id: this.isUpdating ? this.selectedPostId : Math.floor(Math.random() * 100),
      title: this.title?.value,
      body: this.body?.value,
      userId: this.userId?.value
    }
    if( this.isUpdating ){
      this.posts = this.posts.map(post =>{
        if( post.id === payload.id ){
          post.title = payload.title
          post.body = payload.body
          post.userId = payload.userId
        }
        return post
      })
    }
    else this.posts.unshift(payload)
    this.addPost.reset()
    let message = this.isUpdating ? 'Post updated successfully' : 'Post added successfully'
    this._snackbar.open(message, 'OK', { duration: 3000 })
    this.isUpdating = false
  }
}
