import { useState } from "react";

export default function ForgotPasswordPage() {
     const [email, setEmail] = useState("");
     const [isSubmitting, setIsSubmitting] = useState(false);
     const [message, setMessage] = useState("");

     const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();
          setIsSubmitting(true);

          try {
               const response = await fetch("/api/user/password", {
                    method: "POST",
                    headers: {
                         "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email }),
               });

               const data = await response.json();

               if (!response.ok) {
                    throw new Error(data.error || "Failed to send reset email.");
               }

               setMessage("Password reset email sent. Please check your inbox.");
          } catch (error: any) {
               setMessage(error.message || "Something went wrong. Please try again.");
          } finally {
               setIsSubmitting(false);
          }
     };

     return (
          <div className="container py-10">
               <h1 className="text-3xl font-bold mb-6">Forgot Password</h1>
               <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                         <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                              Email
                         </label>
                         <input
                              id="email"
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              required
                         />
                    </div>
                    <button
                         type="submit"
                         className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                         disabled={isSubmitting}
                    >
                         {isSubmitting ? "Sending..." : "Send Reset Email"}
                    </button>
               </form>
               {message && <p className="mt-4 text-center text-sm text-gray-700">{message}</p>}
          </div>
     );
}