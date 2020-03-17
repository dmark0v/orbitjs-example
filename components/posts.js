import { Component } from 'react';
import Link from 'next/link';
import { OrbitService } from '../orbit/service.mjs';

class Posts extends Component {
  constructor (props) {
    super(props);

    this.state = { posts: [] };
  }
  async componentDidMount () {
    let posts = [];

    try {
      posts = await OrbitService.memory.query(q => q.findRecords("post"));
    } catch (e) {
      console.log(e);
    }

    this.setState({ posts });
  }

  render() {
      return (
        <div>
          <h2>Posts</h2>
            { this.state.posts.map(post => {
                return (
                  <p>
                    <Link href={`/posts/${post.id}`}>
                      <a>{post.attributes.title}</a>
                    </Link>
                  </p>
                );
            })}
          <Link href="/posts/add">
            <button>
              Add New Post
            </button>
          </Link>
        </div>
      );
  }
}

export default Posts;