export default function CareersPage() {
     return (
          <main className="container mx-auto px-4 py-8 animate-fade-in">
               <h1 className="text-4xl font-bold mb-4">Careers</h1>
               <p className="text-lg text-gray-700">
                    Join our team and help us build the future of sustainable commerce. Check out our open positions below.
               </p>
               <ul className="mt-6 space-y-4">
                    <li className="border p-4 rounded-md shadow-sm">
                         <h2 className="text-xl font-semibold">Frontend Developer</h2>
                         <p className="text-gray-600">Location: Remote</p>
                    </li>
                    <li className="border p-4 rounded-md shadow-sm">
                         <h2 className="text-xl font-semibold">Backend Developer</h2>
                         <p className="text-gray-600">Location: Remote</p>
                    </li>
               </ul>
          </main>
     )
}