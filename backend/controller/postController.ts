import { Post, IPost } from '../schema/schema';
import mongoose from 'mongoose';


// Functia pentru adăugarea unei noi postări
export async function addPost(postData: IPost, userId: string): Promise<{ message: string, post?: IPost }> {
    try {
        // Convert userId to string and assign it to creatorId

        postData.creatorId = String(userId);

        const newPost = new Post(postData);
        console.log("Adăugare postare...");
        await newPost.save();
        console.log('Postarea a fost adăugată cu succes');
        return {  message: 'Postare adăugată cu succes'};
    } catch (error) {
        console.error('Eroare la adăugarea postării:', error);
        return { message: 'Eroare la adăugarea postării' };
    }
}


// Functia pentru actualizarea unei postări
export async function updatePost(postId: string, postData: Partial<IPost>): Promise<{ message: string, post?: IPost }> {
    try {
        const updatedPost = await Post.findByIdAndUpdate(postId, postData, { new: true });
        if (!updatedPost) {
            return { message: 'Postarea nu a fost găsită' };
        }
        return { message: 'Postare actualizată cu succes'};
    } catch (error) {
        console.error('Eroare la actualizarea postării:', error);
        return { message: 'Eroare la actualizarea postării' };
    }
}

// Functia pentru ștergerea unei postări
export async function deletePost(postId: string): Promise<string> {
    try {
        const deletedPost = await Post.findByIdAndDelete(postId);
        if (!deletedPost) {
            return 'Postarea nu a fost găsită';
        }
        return 'Postare ștearsă cu succes';
    } catch (error) {
        console.error('Eroare la ștergerea postării:', error);
        return 'Eroare la ștergerea postării';
    }
}

// Functia pentru recuperarea unei postări
export async function getPost(postId: string): Promise<{ message: string, post?: IPost }> {
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return { message: 'Postarea nu a fost găsită' };
        }
        return { message: 'Postare găsită', post: post };
    } catch (error) {
        console.error('Eroare la recuperarea postării:', error);
        return { message: 'Eroare la recuperarea postării' };
    }
}

// Aici puteți adăuga și alte funcții necesare pentru gestionarea postărilor
