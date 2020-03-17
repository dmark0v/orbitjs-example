import { useRouter } from 'next/router';
import dynamic from 'next/dynamic'
const PostComponent = dynamic(() => import('../../components/post.js'), {
	ssr: false
});

function Post () {
  const router = useRouter();
  const { pid } = router.query;

  return (
    <PostComponent pid={pid}/>
  );
}

export default Post;