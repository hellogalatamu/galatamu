"use server";

import fs from "fs/promises";
import path from "path";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";
import { collection, query, where, getDocs, updateDoc, doc, arrayUnion } from "firebase/firestore";
import { db as firestoreDb } from "@/lib/firebase";

const getFilePath = () => path.join(process.cwd(), "lib", "localDb.json");

export async function saveInvitationLocal(data: any) {
  const filePath = getFilePath();
  let db: any[] = [];
  try {
    const file = await fs.readFile(filePath, "utf8");
    db = JSON.parse(file);
  } catch (e) {
    db = [];
  }
  
  // Check if exists
  const index = db.findIndex((item: any) => item.slug === data.slug);
  if (index >= 0) {
    db[index] = { ...db[index], ...data };
  } else {
    db.push(data);
  }

  await fs.writeFile(filePath, JSON.stringify(db, null, 2));
  revalidatePath('/admin');
  return true;
}

export async function getInvitationLocal(slug: string) {
  const filePath = getFilePath();
  try {
    const file = await fs.readFile(filePath, "utf8");
    const db = JSON.parse(file);
    return db.find((item: any) => item.slug === slug) || null;
  } catch (e) {
    return null;
  }
}

export async function updateInvitationLocal(slug: string, updateData: any) {
  const filePath = getFilePath();
  try {
    const file = await fs.readFile(filePath, "utf8");
    const db = JSON.parse(file);
    const index = db.findIndex((item: any) => item.slug === slug);
    if (index >= 0) {
      db[index] = { ...db[index], ...updateData };
      await fs.writeFile(filePath, JSON.stringify(db, null, 2));
      revalidatePath('/admin');
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
}

export async function getAllInvitationsLocal() {
  noStore();
  const filePath = getFilePath();
  try {
    const file = await fs.readFile(filePath, "utf8");
    return JSON.parse(file);
  } catch (e) {
    return [];
  }
}

export async function togglePaymentStatusLocal(slug: string, isPaid: boolean) {
  const filePath = getFilePath();
  try {
    const file = await fs.readFile(filePath, "utf8");
    const db = JSON.parse(file);
    const index = db.findIndex((item: any) => item.slug === slug);
    if (index >= 0) {
      db[index].is_paid = isPaid;
      await fs.writeFile(filePath, JSON.stringify(db, null, 2));
      revalidatePath('/admin');
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
}

export async function submitWishLocal(slug: string, wish: any) {
  const filePath = getFilePath();
  try {
    const file = await fs.readFile(filePath, "utf8");
    const db = JSON.parse(file);
    const index = db.findIndex((item: any) => item.slug === slug);
    if (index >= 0) {
      if (!db[index].wishes) {
        db[index].wishes = [];
      }
      db[index].wishes.push(wish);
      await fs.writeFile(filePath, JSON.stringify(db, null, 2));
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
}

export async function submitWish(slug: string, wish: any) {
  const isDummy = !process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY === "dummy-api-key";

  if (isDummy) {
    return await submitWishLocal(slug, wish);
  }

  try {
    const q = query(collection(firestoreDb, "invitations"), where("slug", "==", slug));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const invitationDoc = querySnapshot.docs[0];
      await updateDoc(doc(firestoreDb, "invitations", invitationDoc.id), {
        wishes: arrayUnion(wish)
      });
      return true;
    }
    
    // Fallback to local if not found in Firebase (might be a newly created local one)
    return await submitWishLocal(slug, wish);
  } catch (error) {
    console.error("Error submitting wish to Firebase:", error);
    return await submitWishLocal(slug, wish);
  }
}

export async function createInvitationAdminLocal(slug: string, theme_id: string) {
  const filePath = getFilePath();
  const edit_token = crypto.randomUUID();
  
  const newData = {
    slug,
    theme_id,
    is_paid: true,
    edit_token,
    bride_data: { groom: "", bride: "", parents_groom: "", parents_bride: "" },
    event_data: { date: "", akad_time: "", akad_location: "", resepsi_time: "", resepsi_location: "" },
    createdAt: new Date().toISOString()
  };

  try {
    const file = await fs.readFile(filePath, "utf8");
    const db = JSON.parse(file);
    
    // Check if slug already exists
    if (db.find((item: any) => item.slug === slug)) {
      return { success: false, message: "Slug sudah digunakan." };
    }

    db.push(newData);
    await fs.writeFile(filePath, JSON.stringify(db, null, 2));
    revalidatePath('/admin');
    return { success: true, token: edit_token };
  } catch (e) {
    // If file doesn't exist, start new
    const db = [newData];
    await fs.writeFile(filePath, JSON.stringify(db, null, 2));
    revalidatePath('/admin');
    return { success: true, token: edit_token };
  }
}

export async function deleteInvitationLocal(slug: string): Promise<boolean | string> {
  const filePath = getFilePath();
  try {
    const file = await fs.readFile(filePath, "utf8");
    const db = JSON.parse(file);
    const newDb = db.filter((item: any) => item.slug !== slug);
    if (db.length === newDb.length) return "Slug tidak ditemukan di database";
    await fs.writeFile(filePath, JSON.stringify(newDb, null, 2));
    return true;
  } catch (e: any) {
    console.error("Delete failed:", e);
    return e.message || String(e);
  }
}

export async function updateInvitationFullLocal(oldSlug: string, newData: any) {
  const filePath = getFilePath();
  try {
    const file = await fs.readFile(filePath, "utf8");
    const db = JSON.parse(file);
    const index = db.findIndex((item: any) => item.slug === oldSlug);
    if (index >= 0) {
      db[index] = { ...db[index], ...newData };
      await fs.writeFile(filePath, JSON.stringify(db, null, 2));
      revalidatePath('/admin');
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
}
