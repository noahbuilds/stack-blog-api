import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Blog } from './entities/blog.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ResourceCreated } from 'src/helpers/ResourceCreated';
import { ResourceModified } from 'src/helpers/ResourceModified';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<Blog>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  create = async (createBlogDto: CreateBlogDto): Promise<ResourceCreated> => {
    const blog = new Blog();

    blog.body = createBlogDto.body;
    blog.image = createBlogDto.image;

    blog.title = createBlogDto.title;

    blog.author = createBlogDto.author;
    const savedBlog = await this.blogModel.create(blog);
    return new ResourceCreated(savedBlog.id);
  };

  findAll = async (
    page: number,
    limit: number,
    title?: string,
  ): Promise<{ data: any[] }> => {
    if (title) {
      console.log(title);
      const regex = new RegExp(title, 'i');
      const count = await this.blogModel
        .countDocuments({ title: { $regex: regex } })
        .exec();
      // const skip = (page - 1) * limit;

      const foundBlogs = await this.blogModel
        .find({ title: { $regex: regex } })
        .skip(page)
        .limit(limit)

        .populate('author')
        .exec();

      const result = foundBlogs.map((blog) => {
        return {
          _id: blog._id,
          title: blog.title,
          body: blog.body,
          author: blog.author,
          image: blog.image,
          createdAt: blog.createdAt,
          updatedAt: blog.updatedAt,
        };
      });

      const destructuredData = {
        data: result,
        page: page,
        limit: limit,
        total: count,
      };
      return destructuredData;
    }
    if (!title) {
      const count = await this.blogModel.countDocuments({}).exec();
      // const skip = (page - 1) * limit;

      const foundBlogs = await this.blogModel
        .find()
        .skip(page)
        .limit(limit)

        .populate('author')
        .exec();

      const result = foundBlogs.map((blog) => {
        return {
          _id: blog._id,
          title: blog.title,
          body: blog.body,
          author: blog.author,
          image: blog.image,
          createdAt: blog.createdAt,
          updatedAt: blog.updatedAt,
        };
      });

      const destructuredData = {
        data: result,
        page: page,
        limit: limit,
        total: count,
      };
      return destructuredData;
    }
  };

  findOne = async (id: string): Promise<Blog> => {
    const foundBlog = await this.blogModel
      .findById(id)
      .populate('author')
      .exec();

    if (!foundBlog) {
      throw new HttpException('Block not found', HttpStatus.NOT_FOUND);
    }
    return foundBlog;
  };

  update = async (id: string, updateBlogDto: UpdateBlogDto) => {
    const foundBlog = await this.blogModel.findById(id);
    if (!foundBlog) {
      throw new HttpException('Blog not Found', HttpStatus.NOT_FOUND);
    }
    const dataToUpdate = {
      body: updateBlogDto.body,
      image: updateBlogDto.image,

      title: updateBlogDto.title,
    };
    const updatedBlog = await this.blogModel.findByIdAndUpdate(
      id,
      dataToUpdate,
      { new: true },
    );

    if (!updatedBlog) {
      throw new HttpException(
        'Update failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return new ResourceModified(updatedBlog.id);
  };

  remove = async (id: string): Promise<ResourceModified> => {
    const foundBlog = await this.blogModel.findById(id);

    if (!foundBlog) {
      throw new HttpException('Block not found', HttpStatus.NOT_FOUND);
    }
    const deletedBlog = await this.blogModel.findByIdAndDelete(foundBlog.id);
    return new ResourceModified(deletedBlog.id);
  };
}
