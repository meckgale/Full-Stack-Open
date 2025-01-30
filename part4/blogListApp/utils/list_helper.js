const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  const mostLiked = blogs.reduce((mostLiked, current) => {
    return current.likes > (mostLiked?.likes || 0) ? current : mostLiked;
  }, null);
  return mostLiked
    ? {
        title: mostLiked.title,
        author: mostLiked.author,
        likes: mostLiked.likes,
      }
    : null;
};

const mostBlogs = (blogs) => {
  const result = blogs.reduce(
    (accumulator, current) => {
      accumulator.publications[current.author] =
        (accumulator.publications[current.author] || 0) + 1;

      if (
        accumulator.publications[current.author] >
        accumulator.mostProlificAuthor.blogs
      ) {
        accumulator.mostProlificAuthor.author = current.author;
        accumulator.mostProlificAuthor.blogs =
          accumulator.publications[current.author];
      }

      return accumulator;
    },
    {
      publications: {},
      mostProlificAuthor: { author: null, blogs: 0 },
    }
  );
  return result.mostProlificAuthor;
};

const mostLikes = (blogs) => {
  const result = blogs.reduce(
    (acc, blog) => {
      if (!acc.allBloggers[blog.author]) {
        acc.allBloggers[blog.author] = 0;
      }

      acc.allBloggers[blog.author] += blog.likes;

      if (acc.allBloggers[blog.author] > acc.favoriteBlogger.likes) {
        acc.favoriteBlogger.author = blog.author;
        acc.favoriteBlogger.likes = acc.allBloggers[blog.author];
      }

      return acc;
    },
    {
      allBloggers: {},
      favoriteBlogger: { author: null, likes: 0 },
    }
  );

  return result.favoriteBlogger;
};

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes };
