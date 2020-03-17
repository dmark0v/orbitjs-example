import { Component } from 'react';
import Router from 'next/router'
import { OrbitService } from '../../orbit/service.mjs';

export default class NewPost extends Component {
  constructor (props) {
    super(props);

    this.addPost = this.addPost.bind(this);
  }

  async addPost () {
    const post = {
      type: 'post',
      attributes: {
        title: this.title.value,
        message: this.message.value
      }
    }

    OrbitService.schema.initializeRecord(post);

    await OrbitService.memory.update(t => [
      t.addRecord(post)
    ]);

    await OrbitService.memory.query(q => q.findRecord({ type: "post", id: post.id }));

    Router.push(`/posts/${post.id}`);
  }

  render () {
    return (
      <div>
        <h2>New Post</h2>
        <div className="post-new-title"></div>
          <label htmlFor="post-title">Title:</label>
          <input id="post-title" type="text" ref={(input) => this.title = input}/>
        <div className="post-new-message">
          <label htmlFor="post-message">Message:</label>
          <textarea id="post-message" rows="10" cols="100"  ref={(input) => this.message = input}/>
        </div>
        <button onClick={this.addPost}>Save</button>
      </div>
    );
  }
}