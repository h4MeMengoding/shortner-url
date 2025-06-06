import CreateUrlForm from '@/components/dashboard/CreateUrlForm';

export default function CreatePage() {
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-100 mb-2">
          Create Short URL
        </h1>
        <p className="text-gray-400">
          Transform your long URLs into short, memorable links with analytics and QR codes.
        </p>
      </div>
      
      <CreateUrlForm />
    </div>
  );
}
