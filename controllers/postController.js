const { Post } = require('../models');
const path = require('path');

// Create a new post with image
exports.createPost = async (req, res) => {
     const { title, content, tags } = req.body;
     console.log(req.body)
     let imageUrl = '';

     if (req.file) {
          imageUrl = `/uploads/${req.file.filename}`;
     }

     try {
          await Post.create({
               title,
               content,
               tags,
               imageUrl,
               userId: req.session.user.id,
          });
          req.flash('success_msg', 'Post created successfully.');
          res.redirect('/users/profile');
     } catch (error) {
          console.error(error);
          res.status(500).send('Server Error');
     }
};

// Edit an existing post (with image update)
exports.editPost = async (req, res) => {
     const { title, content, tags } = req.body;
     let imageUrl = req.body.existingImage;

     if (req.file) {
          imageUrl = `/uploads/${req.file.filename}`;
     }

     try {
          await Post.update(
               { title, content, tags, imageUrl },
               { where: { id: req.params.id, userId: req.session.user.id } }
          );
          req.flash('success_msg', 'Post updated successfully.');
          res.redirect('/users/profile');
     } catch (error) {
          console.error(error);
          res.status(500).send('Server Error');
     }
};

// Delete a post
exports.deletePost = async (req, res) => {
     try {
          await Post.destroy({ where: { id: req.params.id, userId: req.session.user.id } });
          req.flash('success_msg', 'Post deleted successfully.');
          res.redirect('/users/profile');
     } catch (error) {
          console.error(error);
          res.status(500).send('Server Error');
     }
};
