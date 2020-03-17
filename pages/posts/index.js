import dynamic from 'next/dynamic'
const PostsComponent = dynamic(() => import('../../components/posts.js'), {
	ssr: false
});

function Posts ({ posts }) {
  return (
    <PostsComponent/>
  );
}

export default Posts;