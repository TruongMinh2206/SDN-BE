import mongoose, { get } from "mongoose";

// ** Models
import Folder from "../models/Folder";
import User from "../models/User";
import { authConstant, httpConstant, folderConstrant } from "../constant";

export const folderService = {
    createFolder: async (userId, data) => {
        const folder = await Folder.create({
          ...data,
          userId,
        });  
        const folderJson = folder.toJSON();    
        return folderJson;
      },
    getAllFolder: async (limit, offset, search) => {
        const limitNum = Number.parseInt(limit);
        const offsetNum = Number.parseInt(offset);
      
        const query = {
          isDelete: false,
          title: { $regex: new RegExp(search || "", "i") }, // Tìm kiếm theo title (có thể thay đổi trường cần tìm kiếm)
        };
      
        const data = await Folder.find(query)
          .limit(limitNum)
          .skip(limitNum * offsetNum)
          .exec();
      
        const totalCount = await Folder.countDocuments(query);
      
        // Sử dụng Promise.all để thực hiện bất kỳ xử lý tùy chỉnh nào trên dữ liệu nếu cần thiết
      
        return {
          limit: limitNum,
          offset: offsetNum,
          totalPage: Math.ceil(totalCount / limitNum),
          folders: data,
        };
      },      
    deleteFolder: async (userId, folderId) => {
      const folder = await Folder.findById(folderId);
  
      if (!folder) throw new Error(folderConstrant.FOLDER_NOT_FOUND);
      if (!folder.userId.equals(userId))
        throw new Error(authConstant.FORBIDDEN);
  
      folder.isDelete = true;
  
      await folder.save();
  
      const folderJson = folder.toJSON();
  
      return folderJson;
    },
  // updateFolderbyFolderId: async (userId, data) =>{
  //     const folder = await Folder.findById(data?.id)
  //     console.log(data?.id);
  //   },

}