// import React from 'react'
import { notFound } from "next/navigation";
export default function Blogpage({ params }) {
  const { id } = params;
  if (id >= "3") {
    return notFound();
  }
  return <div className="mt-6">The blog id is : {id}</div>;
}
