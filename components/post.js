import { Component } from 'react';
import { OrbitService } from '../orbit/service.mjs';
import Link from 'next/link';

class Post extends Component {
  constructor (props) {
    super(props);

    this.state = { post: {} };
  }
  async componentDidMount () {
    let post = { attributes: {} };

    try {
      post = await OrbitService.memory.query(q => q.findRecord({ type: "post", id: this.props.pid }));
    } catch (e) {
      console.log(e);
    }

    this.setState({ post: post.attributes });
  }

  render() {
      return (
        <div>
          <div>
            <h2>{this.state.post.title}</h2>
            <div>{this.state.post.message}</div>
          </div>
          <div>
            <Link href="/posts"><a>Posts</a></Link>
          </div>
        </div>
      );
  }
}

export default Post;