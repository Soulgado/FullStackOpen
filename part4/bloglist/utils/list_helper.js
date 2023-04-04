const lodash = require("lodash");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  if (blogs.length === 0) return 0;
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

const favouriteBlog = (blogs) => {
  if (blogs.length === 0) return;
  const likes = blogs.map(blog => blog.likes);
  const maximum = Math.max(...likes);
  const indexOfMax = likes.indexOf(maximum);
  return {
    title: blogs[indexOfMax].title,
    author: blogs[indexOfMax].author,
    likes: maximum
   };
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return;
  const countByAuthor = lodash.countBy(blogs, (b) => b.author);
  const mostPopular = lodash.maxBy(Object.entries(countByAuthor), (e) => e[1]);
  return { author: mostPopular[0], blogs: mostPopular[1] };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) return;
  const mostLikesBlog = lodash.maxBy(blogs, (b) => b.likes);
  const totalLikes = blogs.reduce((accumulator, current) => {
    if (current.author === mostLikesBlog.author) {
      return accumulator + current.likes;
    } else {
      return accumulator;
    }
  }, 0);
  return { author: mostLikesBlog.author, likes: totalLikes };
};

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes
};

