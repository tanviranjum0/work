const handleAddComment = async () => {
  const email = document.getElementById("email-comment").value;
  const fullname = document.getElementById("fullname-comment").value;
  const message = document.getElementById("message-comment").value;
  console.log({ email, fullname, message });
};

const getReadyBlogPage = () => {
  const blog = JSON.parse(localStorage.getItem("blog-details"));
  blog.category.map((c) => {
    const node = document.createElement("a");
    const textnode = document.createTextNode(c);
    node.appendChild(textnode);
    document.getElementById("category-container").appendChild(node);
  });
  blog.tags.map((t) => {
    const node = document.createElement("a");
    const textnode = document.createTextNode(t);
    node.appendChild(textnode);
    document.getElementById("tags-container").appendChild(node);
  });
  document.getElementById("blog-details-main-title").innerText = blog.title;
  // document.getElementById("blog-title").innerText = blog.title;
  document.getElementById("blog-content-container").innerText = blog.content;
};

getReadyBlogPage();

// const demoBlogs = [
//   {
//     id: 1,
//     title: "What sizes do MacBook Airs come in?",
//     secondaryTitle: "Some for secondary title",
//     visibility: "public",
//     createdAt: "2025-03-12T15:50:31.832+00:00",
//     content:
//       "new report said earlier this week that Apple is working on a brand new laptop. Apple plans to release a 15-inch MacBook Air in 2023, a first for the Air series. A trusted Apple insider with a proven track record confirmed that Apple is working on the larger MacBook Air.However, Apple might not include it in the Air series when it launches it. As for the notebook&apos;s release date, the 15-inch MacBook isn&apos;t coming soon. It&apos;ll get a late 2023 release at best, according to the new claims.",
//     category: ["Design", "Development"],
//     tags: ["macbook", "iphone"],
//     poster:
//       "https://res.cloudinary.com/tanviranjum/image/upload/v1741648444/h7inqzeuap1adxbpflbu.png",
//   },
//   {
//     id: 2,
//     title: "Savor More, Win More with Pathao Food",
//     secondaryTitle: "Some for secondary title",
//     visibility: "public",
//     createdAt: "2025-03-12T15:50:31.832+00:00",
//     content:
//       "Attention food enthusiasts and Pathao Food lovers, Pathao Food presents an exciting contest where your love for delicious meals can earn you incredible rewards. Customers with the highest order value on Pathao Food, with a minimum order value of BDT 2,000, will be eligible for exclusive prizes. The top ten customers will receive APEX gift vouchers worth up to BDT 2,500.",
//     category: ["Writing", "Business"],
//     tags: ["Ride Share", "Pathao"],
//     poster:
//       "https://i0.wp.com/picjumbo.com/wp-content/uploads/violet-colorful-sunset-sky-on-the-beach-free-photo.jpeg?w=600&quality=80",
//   },
//   {
//     id: 3,
//     title: "Firni Delight: Prepare It Yourself!",
//     secondaryTitle: "Some for secondary title",
//     visibility: "public",
//     createdAt: "2025-03-12T15:50:31.832+00:00",
//     content:
//       "Firni, a cherished South Asian dessert, is a creamy rice pudding that has graced our tables for generations. Its velvety texture and aromatic flavors make it a favorite during festivals and special occasions like Ramadan. But should you roll up your sleeves to prepare it at home, or simply order it from Pathao Food? Let’s explore both options.",
//     category: ["Design", "Health"],
//     tags: ["Food", "Yummy"],
//     poster:
//       "https://images.ctfassets.net/hrltx12pl8hq/4f6DfV5DbqaQUSw0uo0mWi/6fbcf889bdef65c5b92ffee86b13fc44/shutterstock_376532611.jpg?fit=fill&w=600&h=400",
//   },
//   {
//     id: 4,
//     title: "Savor More, Win More with Pathao Food",
//     secondaryTitle: "Some for secondary title",
//     visibility: "public",
//     createdAt: "2025-03-12T15:50:31.832+00:00",
//     content:
//       "new report said earlier this week that Apple is working on a brand new laptop. Apple plans to release a 15-inch MacBook Air in 2023, a first for the Air series. A trusted Apple insider with a proven track record confirmed that Apple is working on the larger MacBook Air.However, Apple might not include it in the Air series when it launches it. As for the notebook&apos;s release date, the 15-inch MacBook isn&apos;t coming soon. It&apos;ll get a late 2023 release at best, according to the new claims.",
//     category: ["Design", "Development"],
//     tags: ["macbook", "iphone"],
//     poster:
//       "https://static.desygner.com/wp-content/uploads/sites/13/2022/05/04141642/Free-Stock-Photos-01.jpg",
//   },
//   {
//     id: 5,
//     title:
//       "Empowering Financial Flexibility: Introducing Pathao Advance that allows our Courier merchants to get paid for orders upfront! ",
//     secondaryTitle: "Some for secondary title",
//     visibility: "public",
//     createdAt: "2025-03-12T15:50:31.832+00:00",
//     content:
//       "In today’s fast-paced world, unexpected financial needs can come up. Imagine you suddenly get a lot of orders in your business or you need money right away to pay a bill. It can be tough if you don’t have quick access to cash. ",
//     category: ["Money", "Business"],
//     tags: ["Finance", "Business"],
//     poster:
//       "https://media.istockphoto.com/id/1322104312/photo/freedom-chains-that-transform-into-birds-charge-concept.jpg?s=612x612&w=0&k=20&c=e2XUx498GotTLJn_62tPmsqj6vU48ZEkf0auXi6Ywh0=",
//   },
//   {
//     id: 6,
//     title:
//       "I requested an Advance but I didn’t receive it. Why wasn’t my request approved? ",
//     secondaryTitle: "Some for secondary title",
//     visibility: "public",
//     createdAt: "2025-03-12T15:50:31.832+00:00",
//     content:
//       "There could be different reasons why an Advance request is denied. It could be because there was something unusual or suspicious about the request, or the merchant may have reached the maximum number of Advances allowed at that time. It could also be because the merchant already has outstanding Advances that are past due and need to be repaid before taking another one.",
//     category: ["Help", "Customer Care"],
//     tags: ["Contact", "Help"],
//     poster:
//       "https://images.ctfassets.net/hrltx12pl8hq/28ECAQiPJZ78hxatLTa7Ts/2f695d869736ae3b0de3e56ceaca3958/free-nature-images.jpg?fit=fill&w=1200&h=630",
//   },
// ];
