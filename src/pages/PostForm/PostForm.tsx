import CreatePostHeader from './CreatePostHeader';
import Form from './Form';

export default function PostForm() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex-1">
      <CreatePostHeader />
      <Form />
    </div>
  );
}
