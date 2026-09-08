import TitleField from './TitleField';
import DescriptionField from './DescriptionField';
import ContentEditorField from './ContentEditorField';
import ImageUploadField from './ImageUploadField';
import StateField from './StateField';
import PublishCard from './PublishCard';

export default function PostForm() {
  return (
    <form className={`w-full`} onSubmit={(e) => e.preventDefault()} noValidate>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <TitleField />
          <DescriptionField />
          <ContentEditorField />
        </div>

        <div className="lg:col-span-1 flex flex-col gap-6 sticky top-20">
          <PublishCard />
          <StateField />
          <ImageUploadField />
        </div>
      </div>
    </form>
  );
}
