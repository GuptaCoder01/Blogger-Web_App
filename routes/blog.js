const { Router } = require('express');
const multer = require('multer')
const path = require('path')
const Blog = require('../models/blog')

const router = Router()


const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.resolve(`./public/uploads/`))
	},
	filename: function (req, file, cb) {
		const fileName = `${Date.now()}-${file.orginalname}`;
		cb(null, fileName);
	}
})

const upload = multer({ storage: storage })


router.get('/add-new', (req, res) => {
	return res.render('addBlog', {
		user: req.user,
	})
})


router.get('/:id', async (req, res) => {
	const blog = await Blog.findById(req.params.id).populate('createdBy');
	console.log(blog)
	return res.render('blog', {
		user: req.user,
		blog
	})
})


router.post("/", upload.single('coverImage'), async (req, res) => {
	const { title, body } = req.body;
	const blog = await Blog.create({
		body,
		title,
		createdBy: req.user._id,
		coverImageURL: `/uploads/${req.file.filename}`
	})
	// console.log("file unfailed", blog)

	return res.redirect(`/blog/${blog._id}`)
})

module.exports = router;
