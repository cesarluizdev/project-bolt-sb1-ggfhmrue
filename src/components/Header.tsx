@@ .. @@
 import React from 'react';
-import { Bell, User, Settings } from 'lucide-react';
+import { Bell, User, Settings } from 'lucide-react';
 import { Link } from 'react-router-dom';
 
 export default function Header() {
   return (
     <header className="bg-white shadow-sm border-b border-gray-200">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="flex justify-between items-center h-16">
           <div className="flex items-center">
-            <div className="flex-shrink-0">
-              <h1 className="text-xl font-bold text-gray-900">FoodHub</h1>
-            </div>
+            <Link to="/" className="flex-shrink-0">
+              <img 
   )
 }
+                src="/logo.png" 
+                alt="FoodHub" 
+                className="h-10 w-auto"
+              />
+            </Link>
           </div>
           
           <div className="flex items-center space-x-4">