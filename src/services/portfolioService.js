import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

// Fetch all users
export const fetchAllUsers = async () => {
  try {
    const usersCollection = collection(db, "users");
    const usersSnapshot = await getDocs(usersCollection);
    return usersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// Fetch a specific user's portfolio
export const fetchUserPortfolio = async (userId) => {
  try {
    const portfolioDocRef = doc(db, "portfolios", userId);
    const portfolioDoc = await getDoc(portfolioDocRef);
    
    if (portfolioDoc.exists()) {
      return {
        id: portfolioDoc.id,
        ...portfolioDoc.data()
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching user portfolio:", error);
    throw error;
  }
};

// Fetch a specific user's profile
export const fetchUserProfile = async (userId) => {
  try {
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      return {
        id: userDoc.id,
        ...userDoc.data()
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

// Fetch portfolios by school
export const fetchPortfoliosBySchool = async (schoolName) => {
  try {
    // First get users from that school
    const usersCollection = collection(db, "users");
    const q = query(usersCollection, where("school", "==", schoolName));
    const usersSnapshot = await getDocs(q);
    
    // Then fetch their portfolios
    const userIds = usersSnapshot.docs.map(doc => doc.id);
    const portfolios = [];
    
    for (const userId of userIds) {
      const portfolio = await fetchUserPortfolio(userId);
      if (portfolio) {
        portfolios.push(portfolio);
      }
    }
    
    return portfolios;
  } catch (error) {
    console.error("Error fetching portfolios by school:", error);
    throw error;
  }
};

// Search portfolios by keyword
export const searchPortfolios = async (keyword) => {
  try {
    // This is a simplified search implementation
    // In a real app, you might use Firestore's array-contains or Firebase Extensions like Search
    const portfoliosCollection = collection(db, "portfolios");
    const portfoliosSnapshot = await getDocs(portfoliosCollection);
    
    const results = [];
    const lowerKeyword = keyword.toLowerCase();
    
    for (const doc of portfoliosSnapshot.docs) {
      const data = doc.data();
      
      // Check personal info
      if (data.personalInfo && 
          (data.personalInfo.name?.toLowerCase().includes(lowerKeyword) || 
           data.personalInfo.bio?.toLowerCase().includes(lowerKeyword) ||
           data.personalInfo.school?.toLowerCase().includes(lowerKeyword))) {
        results.push({
          id: doc.id,
          ...data
        });
        continue;
      }
      
      // Check projects
      if (data.projects && data.projects.some(project => 
          project.title?.toLowerCase().includes(lowerKeyword) || 
          project.description?.toLowerCase().includes(lowerKeyword))) {
        results.push({
          id: doc.id,
          ...data
        });
        continue;
      }
      
      // Check leadership
      if (data.leadership && data.leadership.some(item => 
          item.title?.toLowerCase().includes(lowerKeyword) || 
          item.organization?.toLowerCase().includes(lowerKeyword) ||
          item.description?.toLowerCase().includes(lowerKeyword))) {
        results.push({
          id: doc.id,
          ...data
        });
        continue;
      }
      
      // Check skills
      if (data.skills && data.skills.some(skill => 
          skill.name?.toLowerCase().includes(lowerKeyword))) {
        results.push({
          id: doc.id,
          ...data
        });
        continue;
      }
    }
    
    return results;
  } catch (error) {
    console.error("Error searching portfolios:", error);
    throw error;
  }
};
