
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

export type AuthError = {
  message: string;
};

export const getCurrentUser = async (): Promise<User | null> => {
  const { data } = await supabase.auth.getUser();
  return data?.user || null;
};

export const signIn = async (email: string, password: string): Promise<{ user: User | null; error: AuthError | null }> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) {
    return { user: null, error: { message: error.message } };
  }
  
  return { user: data.user, error: null };
};

export const signUp = async (email: string, password: string): Promise<{ user: User | null; error: AuthError | null }> => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });
  
  if (error) {
    return { user: null, error: { message: error.message } };
  }
  
  return { user: data.user, error: null };
};

export const signOut = async (): Promise<{ error: AuthError | null }> => {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    return { error: { message: error.message } };
  }
  
  return { error: null };
};

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
  
  return data;
};

export const updateUserProfile = async (userId: string, profile: { username?: string, avatar_url?: string }) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(profile)
    .eq('id', userId);
  
  if (error) {
    console.error('Error updating profile:', error);
    return { error: error.message };
  }
  
  return { data };
};
