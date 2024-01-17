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

// Functia pentru a obtine un lot de postări
export async function getPosts(batchSize: number, lastRetrievedId?: string): Promise<{ message: string, posts?: IPost[], hasMore: boolean }> {
    try {
        let query = {};
        // Dacă un `lastRetrievedId` este furnizat, adaugă o condiție în interogare pentru a lua următoarele postări
        if (lastRetrievedId) {
            console.log('lastRetrievedId', lastRetrievedId);
            query = { _id: { $gt: lastRetrievedId } };
        }

        // Obține un lot de postări bazat pe `batchSize` și `lastRetrievedId`
        // Sortează-le după ID pentru a păstra ordinea cronologică
        console.log(`Obținere postări...`);
        console.log(`batchSize: ${batchSize}, lastRetrievedId: ${lastRetrievedId}`);
        const posts = await Post.find(query).sort({ _id: 1 }).limit(batchSize);

        let hasMore = false;
        // Verifică dacă există mai multe postări după ultimul ID returnat
        if (posts.length > 0) {
            const lastId = posts[posts.length - 1]._id;
            const countAfterLastId = await Post.countDocuments({ _id: { $gt: lastId } });
            hasMore = countAfterLastId > 0;
        }

        console.log(`Au fost obținute ${posts.length} postări`);
        return { message: 'Postări obținute cu succes', posts, hasMore };
    } catch (error) {
        console.error('Eroare la obținerea postărilor:', error);
        return { message: 'Eroare la obținerea postărilor', hasMore: false };
    }
}

export async function getMYPosts(
    batchSize: number,
    creatorId: string, // Adaugă acest parametru pentru ID-ul creatorului
    lastRetrievedId?: string
): Promise<{ message: string, posts?: IPost[], hasMore: boolean }> {
    try {
        let query: any = { creatorId: creatorId }; // Presupunând că `creator` este câmpul care stochează ID-ul creatorului în documentul postării

        // Dacă un `lastRetrievedId` este furnizat, adaugă o condiție în interogare pentru a lua următoarele postări
        if (lastRetrievedId) {
            console.log('lastRetrievedId', lastRetrievedId);
            query._id = { $gt: lastRetrievedId };
        }

        // Obține un lot de postări bazat pe `batchSize`, `creatorId` și `lastRetrievedId`
        // Sortează-le după ID pentru a păstra ordinea cronologică
        console.log(`Obținere postări pentru creatorId: ${creatorId}...`);
        console.log(`batchSize: ${batchSize}, lastRetrievedId: ${lastRetrievedId}`);
        const posts = await Post.find(query).sort({ _id: 1 }).limit(batchSize);

        let hasMore = false;
        // Verifică dacă există mai multe postări după ultimul ID returnat
        if (posts.length > 0) {
            const lastId = posts[posts.length - 1]._id;
            const countAfterLastId = await Post.countDocuments({ ...query, _id: { $gt: lastId } });
            hasMore = countAfterLastId > 0;
        }

        console.log(`Au fost obținute ${posts.length} postări pentru creatorId: ${creatorId}`);
        return { message: 'Postări obținute cu succes', posts, hasMore };
    } catch (error) {
        console.error('Eroare la obținerea postărilor:', error);
        return { message: 'Eroare la obținerea postărilor', hasMore: false };
    }
}

