"use client"

import React from "react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export default function ProfileSettingsPage() {
  const [image, setImage] = useState("");
  const [location, setLocation] = useState("");
  const { toast } = useToast();

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      setImage(data.url);
      toast({
        title: "Success",
        description: "Profile image uploaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload image.",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image, location }),
      });

      if (!response.ok) {
        throw new Error("Failed to save profile settings");
      }

      toast({
        title: "Success",
        description: "Profile settings saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to save profile settings.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Profile Settings</h1>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Profile Image</label>
          <input
            type="file"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleImageUpload(e.target.files[0]);
              }
            }}
            className="mt-2"
          />
          {image && <img src={image} alt="Profile" className="mt-4 w-24 h-24 rounded-full" />}
        </div>
        <div>
          <label className="block text-sm font-medium">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City, State"
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          onClick={handleSave}
          className="bg-primary text-white py-2 px-4 rounded hover:bg-primary/90"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}