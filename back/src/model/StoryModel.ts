import {connection} from '../connection'
import story from '../types/story'
import storyCommentModel from './StoryCommentModel'
const storyModel = {
    get: async (where:string, orderBy: string, UserId?:string):Promise<any> => {
        try{
            const result =  await connection.raw(`
            SELECT s.Id, s.Date, s.Title, s.Text, s.UserId, s.Topic,
            r.FirstName, r.LastName, lg.Email, r.UserName,
             (SELECT COUNT(*) FROM likestory as l
             WHERE l.StoryId  = s.Id AND l.liked = true) as 'Likes',  
            (SELECT COUNT(*) FROM likestory as l
             WHERE l.StoryId = s.Id AND l.liked = false) as 'DisLikes',
           ${UserId ? `(select l.liked from likestory as l 
            WHERE l.UserId = `+UserId+` and l.StoryId = s.Id) as 'MyLike',
            (r.Id = `+UserId+`) as 'MyComment',`:""}
            count(c.Id) as 'comments'
            FROM stories AS s
            LEFT JOIN likestory as l ON l.StoryId = s.Id
            LEFT JOIN registrationdata as r ON r.Id = s.UserId
            LEFT JOIN login as lg ON lg.Id = s.UserId
            LEFT JOIN storieslevelcomments1 as c on c.StoryId = s.Id  
            ${where?`WHERE ${where}`: ""}
            group by s.Id
            order by ${orderBy?orderBy:'s.Date DESC'}
            `)
            return result[0];
        }
        catch(err){
            return (err.message || err.sqlMessage)
        }
    },
    getById: async (id:string):Promise<any> => {
        try{
            const result =  await connection.raw(`
                SELECT * FROM stories WHERE id = ${id}
            `)
            
            return result[0][0];
        }
        catch(err){
            return (err.message || err.sqlMessage)
        }
    },
    create: async ({userId, text, title, date, topic}:story):Promise<any> => {
        
        try{
            const result =  await connection.raw(`
                INSERT INTO stories (UserId, Title, Text, Date, Topic)
                VALUES ('${userId}', '${title}', '${text}', '${date}', '${topic}');
            `)
            return result[0].affectedRows;
        }
        catch(err){
            return (err.message || err.sqlMessage)
        }
    },
    like: async (id:string, id_user:string, like:number):Promise<any> => {
        
        try{
            const result1 = await connection.raw(`
                DELETE FROM likestory WHERE UserId = ${id_user} and StoryId = ${id}
            `)
            if(like === -1 || like === 1){
            const result =  await connection.raw(`
                INSERT INTO likestory  VALUE (${id}, ${id_user}, ${like === 1})
            `)
            return result[0].affectedRows;
            }
            return result1[0].affectedRows;
        }
        catch(err){
            return (err.message || err.sqlMessage)
        }
    },
    del: async (StoryId:string, UserId?:string):Promise<any> => {    
        try{   
             console.log("oi")
            await connection.raw(`SELECT Id FROM storieslevelcomments1
            WHERE StoryId = ${StoryId}`)
            .then(async (res):Promise<void> => {
                for(let i = 0; i < res[0].length; i++ ){
                    await storyCommentModel.delLevel1(res[0][i].Id as string)
                }
            })
       

            await connection.raw(`DELETE FROM likestory WHERE (StoryId = ${StoryId})`)

            const result = await connection.raw(`DELETE FROM stories WHERE (Id = ${StoryId} ${UserId?`and UserId = ${UserId}`:""})` )

            return result[0].affectedRows;
        }
        catch(err){
            return (err.message || err.sqlMessage)
        }
    }
}
export default storyModel;