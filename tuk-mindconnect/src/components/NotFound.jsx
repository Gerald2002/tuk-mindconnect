function NotFound() {
    return (
      <div className="h-screen flex items-center justify-center text-center p-6">
        <div>
          <h1 className="text-4xl font-bold text-red-600">404</h1>
          <p className="mt-2 text-gray-700 text-lg">Page Not Found</p>
          <a href="/" className="mt-4 inline-block text-blue-600 underline">Return to Login</a>
        </div>
      </div>
    );
  }
  
  export default NotFound;
  