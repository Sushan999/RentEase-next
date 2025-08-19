export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Unauthorized</h1>
        <p className="text-gray-700 mb-6">
          You are not authorized to view this page.
        </p>
        <a href="/" className="text-blue-600 hover:underline">
          Go to Home
        </a>
      </div>
    </div>
  );
}
