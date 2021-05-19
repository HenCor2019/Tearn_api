const Category = require("../../models/Category.model");
const {
  validateCreation,
  validateOneCategory,
  validateUpdate,
  validateDelete,
} = require("./Category.validator");

const defaultImg =
  "https://img.lovepik.com/free_png/28/89/77/20c58PICzbbWHtc9KEQz8_PIC2018.png_860.png";

const CategoryController = {
  createCategory: async (req, res, next) => {
    try {
      await validateCreation(req.body);

      const { name, description, imgUrl = defaultImg } = req.body;

      const category = await Category.find({ name });

      if (category.length != 0) throw "Category already exist";

      const newCategory = new Category({
        name,
        description,
        imgUrl,
        url: process.env.BASE_URL,
        subjects: [],
      });

      newCategory.url += `category/${newCategory._id}`;

      await newCategory.save();

      return res
        .status(201)
        .json({ error: false, message: "Category was created" })
        .end();
    } catch (err) {
      const message = err?.details ? err.details[0].message : err;
      return res
        .status(400)
        .json({
          error: true,
          message,
        })
        .end();
    }
  },

  allCategories: async (req, res, next) => {
    try {
      const categories = await Category.find({});

      const mappedCategories = categories.map(({ _id, name, imgUrl, url }) => ({
        id: _id,
        name,
        imgUrl,
        url,
      }));

      return res
        .status(200)
        .json({
          error: false,
          count: categories.length,
          results: mappedCategories,
        })
        .end();
    } catch (error) {
      return res
        .status(500)
        .json({ error: true, message: "Something was wrong" });
    }
  },
  oneCategory: async (req, res, next) => {
    try {
      await validateOneCategory(req.params);

      const { id } = req.params;

      const category = await Category.findById(id).populate("subjects", {
        name: 1,
        url: 1,
      });

      const { name, url, imgUrl, description, subjects } = category;

      return res
        .status(200)
        .json({
          error: false,
          id,
          name,
          url,
          imgUrl,
          description,
          subjectCount: subjects.length,
          subjects,
        })
        .end();
    } catch (err) {
      const message = err?.details ? err.detailts[0].message : err.name;

      return res.status(404).json({ error: true, message });
    }
  },

  update: async (req, res) => {
    try {
      await validateUpdate(req.body);

      const { _id } = req.body;

      const category = await Category.find({
        $or: [{ _id }, { name: req.body?.name }],
      });

      if (!category || category.length != 1) throw "Something was wrong";

      const updatedCategory = {
        name: req.body.name || category.name,
        description: req.body.description || category.description,
        imgUrl: req.body.imgUrl || category.imgUrl,
      };

      await Category.findOneAndUpdate(_id, updatedCategory);
      return res.status(200).json({
        error: false,
        message: "Category was updated",
      });
    } catch (err) {
      const message = err?.details ? err.details[0].message : err;

      return res.status(500).json({
        error: true,
        message,
      });
    }
  },
  deleteOne: async (req, res) => {
    try {
      await validateDelete(req.params);
      const { id } = req.params;

      const category = await Category.findById(id);

      if (!category) throw "Category does not exist";

      await Category.findOneAndDelete(id);

      return res
        .status(200)
        .json({ error: false, message: "Category deleted" });
    } catch (err) {
      const message = err?.details ? err.details[0].message : err;

      return res.status(500).json({
        error: true,
        message,
      });
    }
  },
  deleteAll: async (req, res) => {
    try {
      await Category.deleteMany({});
      return res
        .status(200)
        .json({ error: false, message: "Categories was deleted" });
    } catch (err) {
      return res
        .status(500)
        .json({ error: true, message: "Something was wrong" });
    }
  },
};

module.exports = CategoryController;
