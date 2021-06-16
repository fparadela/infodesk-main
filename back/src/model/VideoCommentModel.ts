import {connection} from '../connection'
import comment from '../types/comment'
const VideoModel = {
    create: async ({date, userId, text}:comment, table:string, column:string, value:string):Promise<any> => {    
        try{
            const result =  await connection.raw(`
                INSERT INTO ${table} (UserId, ${column}, Text, Date) 
                VALUES (${userId}, ${value}, '${text}', '${date}');
            `)
            return result[0].affectedRows;
        }
        catch(err){
            return (err.message || err.sqlMessage)
        }
    },
    like: async (id:string, userId:string, like:number, table:string, column:string):Promise<any> => {    
        try{  
            const result1 = await connection.raw(`
                DELETE FROM ${table}  WHERE UserId = ${userId} and ${column} = ${id}
            `)
            if(like === -1 || like === 1){
            const result =  await connection.raw(`
                INSERT INTO ${table} (${column}, UserId, liked) VALUE (${id}, ${userId}, ${like === 1})
            `)
                return result[0].affectedRows;
            }
                return result1[0].affectedRows;

        }
        catch(err){
            return (err.message || err.sqlMessage)
        }
    },
    getLevel1:  async (VideoId:string, userId?:string):Promise<any> => {    
        try{
            const result =  await connection.raw(`
            SELECT c.Id, c.VideoId, c.Date, c.Text, r.FirstName, r.LastName,
            r.UserName,
            (SELECT COUNT(*) FROM likeVideoslevelcomments1 as l
             WHERE l.Comment1Id = c.Id AND l.liked = true) as 'Likes',  
            (SELECT COUNT(*) FROM likeVideoslevelcomments1 as l
             WHERE l.Comment1Id = c.Id AND l.liked = false) as 'DisLikes'
            ${userId ?`,(select l.liked from likeVideoslevelcomments1 as l 
            WHERE l.UserId = `+userId+` and l.Comment1Id = c.Id) as myLike, 
            (r.Id = `+userId+`) as 'MyComment'`: ""}
            FROM Videoslevelcomments1 as c
            LEFT JOIN registrationdata as r ON r.Id = c.UserId
            LEFT JOIN likeVideoslevelcomments1 as l on  l.UserId = c.UserId 
           WHERE c.VideoId = ${VideoId}
           group by c.Id
           order by c.Date DESC
            `)
            return result[0];
        }
        catch(err){
            return (err.message || err.sqlMessage)
        }
    },
    getLevel2:  async (Comment1Id:string, userId?:string):Promise<any> => {    
        try{
            const result =  await connection.raw(`
            SELECT c2.Id, c2.Comment1Id , c2.Date, c2.Text, r.FirstName,
             r.LastName, r.UserName,
            (SELECT COUNT(*) FROM likeVideoslevelcomments2 as l
             WHERE l.Comment2Id = c2.Id AND l.liked = true) as 'Likes',  
            (SELECT COUNT(*) FROM likeVideoslevelcomments2 as l
             WHERE l.Comment2Id = c2.Id AND l.liked = false) as 'DisLikes'
            ${userId ?`,(select l.liked from likeVideoslevelcomments2 as l 
            WHERE l.UserId = `+userId+` and l.Comment2Id = c2.Id) as myLike, 
            (r.Id = `+userId+`) as 'MyComment'`: ""}
            FROM Videoslevelcomments2 as c2
            LEFT JOIN registrationdata as r ON r.Id = c2.UserId
            LEFT JOIN likeVideoslevelcomments2 as l on  l.UserId = c2.UserId 
           WHERE c2.Comment1Id = ${Comment1Id}
           group by c2.Id
           order by c2.Date DESC
            `)
            return result[0];
        }
        catch(err){
            return (err.message || err.sqlMessage)
        }
    },
    getLevel3:  async (Comment2Id:string, userId?:string):Promise<any> => {    
        try{
            const result =  await connection.raw(`
            SELECT c3.Id, c3.Comment2Id , c3.Date, c3.Text,
             r.FirstName, r.LastName, r.UserName,
            (SELECT COUNT(*) FROM likeVideoslevelcomments3 as l
             WHERE l.Comment3Id = c3.Id AND l.liked = true) as 'Likes',  
            (SELECT COUNT(*) FROM likeVideoslevelcomments3 as l
             WHERE l.Comment3Id = c3.Id AND l.liked = false) as 'DisLikes'
             ${userId ?`,(select l.liked from likeVideoslevelcomments3 as l 
            WHERE l.UserId = `+userId+` and l.Comment3Id = c3.Id) as myLike, 
            (r.Id = `+userId+`) as 'MyComment'` : ""}
            FROM Videoslevelcomments3 as c3
            LEFT JOIN registrationdata as r ON r.Id = c3.UserId
            LEFT JOIN likeVideoslevelcomments3 as l on  l.UserId = c3.UserId 
           WHERE c3.Comment2Id = ${Comment2Id}
           group by c3.Id
           order by c3.Date DESC
            `)
            return result[0];
        }
        catch(err){
            return (err.message || err.sqlMessage)
        }
    },
    delLevel1: async (Comment1Id:string, UserId?:string):Promise<any> => {    
        try{   
             
            await connection.raw(`SELECT Id FROM videoslevelcomments2
            WHERE Comment1Id = ${Comment1Id}`)
            .then(async (res):Promise<void> => {
                for(let i = 0; i < res[0].length; i++ ){
                    await VideoModel.delLevel2(res[0][i].Id as string)
                }
            })
       

            await connection.raw(`DELETE FROM likevideoslevelcomments1 WHERE  (Comment1Id = ${Comment1Id})`)

            const result = await connection.raw(`DELETE FROM videoslevelcomments1 WHERE (Id = ${Comment1Id} ${UserId?`and UserId = ${UserId}`:""})`)

            console.log( result)
        }
        catch(err){
            return (err.message || err.sqlMessage)
        }
    },
    delLevel2:  async (Comment2Id:string, UserId?:string):Promise<any> => {    
        try{   
             
            await connection.raw(`SELECT Id FROM videoslevelcomments3
            WHERE Comment2Id = ${Comment2Id}`)
            .then(async (res):Promise<void> => {
                for(let i = 0; i < res[0].length; i++ ){
                    await VideoModel.delLevel3(res[0][i].Id as string)
                }
            })
       

            console.log("oii") 
            await connection.raw(`DELETE FROM likevideoslevelcomments2 WHERE  (Comment2Id = ${Comment2Id})`)

            const result = await connection.raw(`DELETE FROM videoslevelcomments2 WHERE (Id = ${Comment2Id} ${UserId?`and UserId = ${UserId}`:""})` )

            console.log( result)
        }
        catch(err){
            return (err.message || err.sqlMessage)
        }
    },
    delLevel3: async (Comment3Id:string, UserId?:string):Promise<any> => {    
        try{

            await connection.raw(`DELETE FROM likevideoslevelcomments3 WHERE  (Comment3Id = ${Comment3Id})`)

            const result = await connection.raw(`DELETE FROM videoslevelcomments3  WHERE (Id = ${Comment3Id} ${UserId?`and UserId = ${UserId}`:""})` )
            console.log(result)
        }
        catch(err){
            return (err.message || err.sqlMessage)
        }
    }
}
export default VideoModel;