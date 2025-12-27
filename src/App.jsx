import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  Plus, 
  Trash2, 
  FileSpreadsheet,
  Calculator,
  Upload,
  Loader2,
  AlertCircle,
  ShieldCheck,
  Edit3,
  Check,
  LogOut,
  User,
  Hash,
  Lock,
  UserPlus,
  Calendar,
  Filter,
  Layers,
  ChevronDown,
  Download,
  X
} from 'lucide-react';
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithCustomToken, 
  onAuthStateChanged,
  signInAnonymously,
  signOut
} from "firebase/auth";
import { getFirestore, collection, doc, setDoc, deleteDoc, onSnapshot, getDoc } from "firebase/firestore";

// --- Firebase Initialization ---
const getFirebaseConfig = () => {
  // This check ensures the preview environment works securely
  if (typeof __firebase_config !== 'undefined') {
    return JSON.parse(__firebase_config);
  }
  
  // YOUR SPECIFIC CONFIGURATION
  return {
    apiKey: "AIzaSyCh-bfIRPtR5ecbDJGy1_7mRaoFjX-B_ok",
    authDomain: "gradebook-28879.firebaseapp.com",
    projectId: "gradebook-28879",
    storageBucket: "gradebook-28879.firebasestorage.app",
    messagingSenderId: "199098992822",
    appId: "1:199098992822:web:b32e86cd20a176aa4b7e17"
  };
};

const app = initializeApp(getFirebaseConfig());
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

// --- Constants ---
const TERM_ORDER = ['UT1', 'SA1', 'UT2', 'SA2'];

// --- Auth Component ---
const AuthScreen = ({ onLogin, onRegister, error, isLoading }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");

  const handlePinChange = (e) => {
    // Limit to 4 digits
    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
    setPin(val);
  };

  const handleUsernameChange = (e) => {
    const val = e.target.value.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase();
    setUsername(val);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRegistering) {
      onRegister(username, pin);
    } else {
      onLogin(username, pin);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <div className="p-8 bg-indigo-600 text-center relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <div className="absolute right-[-20px] top-[-20px] w-32 h-32 rounded-full bg-white"></div>
              <div className="absolute left-[-20px] bottom-[-20px] w-24 h-24 rounded-full bg-white"></div>
           </div>
           
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/20 rounded-2xl mx-auto flex items-center justify-center backdrop-blur-sm mb-4 border border-white/20">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">Gradebook Assistant</h2>
            <p className="text-indigo-100 text-sm font-medium">Secure Teacher Workspace</p>
          </div>
        </div>
        
        <div className="p-8">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-slate-800">
              {isRegistering ? "Create Account" : "Welcome Back"}
            </h3>
            <p className="text-slate-500 text-sm mt-1">
              {isRegistering ? "Set up your unique username and PIN" : "Enter your credentials to access data"}
            </p>
          </div>
          
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg flex items-start gap-2 animate-pulse-slow">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{String(error)}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  required
                  value={username}
                  onChange={handleUsernameChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-700 font-medium"
                  placeholder="e.g. teacher_smith"
                  autoCapitalize="none"
                  autoCorrect="off"
                  minLength={3}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">4-Digit PIN</label>
              <div className="relative">
                <Hash className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
                <input 
                  type="password" 
                  inputMode="numeric"
                  pattern="[0-9]*"
                  required
                  value={pin}
                  onChange={handlePinChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-700 tracking-[0.3em] font-bold text-lg"
                  placeholder="••••"
                  maxLength={4}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading || username.length < 3 || pin.length < 4}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-bold shadow-sm shadow-indigo-200 transition-all flex items-center justify-center gap-2 mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {isRegistering ? <UserPlus className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  {isRegistering ? "Create Account" : "Access Workspace"}
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button 
                type="button"
                onClick={() => { setIsRegistering(!isRegistering); }}
                className="text-sm text-slate-500 hover:text-indigo-600 font-medium transition-colors"
            >
                {isRegistering ? "Already have an account? Login" : "New user? Create an account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [activeUser, setActiveUser] = useState(null); 
  const [authLoading, setAuthLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const [activeTab, setActiveTab] = useState('grades'); // Default to grades
  const [libLoaded, setLibLoaded] = useState(false); 
  
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [grades, setGrades] = useState({}); 

  const [className, setClassName] = useState("My Gradebook");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  
  // Class Filtering State
  const [selectedClass, setSelectedClass] = useState('All');
  // Import Term State
  const [importTerm, setImportTerm] = useState('UT1');
  
  // UI States
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showAddAssignmentModal, setShowAddAssignmentModal] = useState(false);

  const fileInputRef = useRef(null);

  // --- Derived State ---
  const classes = useMemo(() => {
    const cls = new Set(students.map(s => s.className).filter(c => c && c.trim() !== ''));
    return ['All', ...Array.from(cls).sort()];
  }, [students]);

  const filteredStudents = useMemo(() => {
    if (selectedClass === 'All') return students;
    return students.filter(s => s.className === selectedClass);
  }, [students, selectedClass]);

  const assignmentsByTerm = useMemo(() => {
    const groups = { 'UT1': [], 'SA1': [], 'UT2': [], 'SA2': [], 'Other': [] };
    assignments.forEach(a => {
        let term = a.term || 'Other';
        if (!groups[term]) term = 'Other'; 
        groups[term].push(a);
    });
    if (groups['Other'].length === 0) delete groups['Other'];
    return groups;
  }, [assignments]);

  // --- Path Helpers ---
  const getPublicCollection = (type) => {
     if (!activeUser) return null;
     return collection(db, 'artifacts', appId, 'public', 'data', `${activeUser}_${type}`);
  }
  
  const getPublicDoc = (type, id) => {
     if (!activeUser) return null;
     return doc(db, 'artifacts', appId, 'public', 'data', `${activeUser}_${type}`, id);
  }

  // --- 1. Authentication & Initialization ---
  useEffect(() => {
    const initAuth = async () => {
      // Check environment first (Canvas)
      if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
        try {
          await signInWithCustomToken(auth, __initial_auth_token);
        } catch (error) { console.error("Custom token auth failed", error); }
      } 
      // Fallback for Netlify/Prod: Anonymous Auth
      if (!auth.currentUser) {
          try {
            await signInAnonymously(auth);
          } catch (err) {
            console.error("Anonymous auth failed", err);
          }
      }
    };
    initAuth();
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setFirebaseUser(currentUser);
      setAuthLoading(false);
      
      if (!currentUser) {
        setActiveUser(null);
        localStorage.removeItem('active_gradebook_username');
      } else {
        const savedUser = localStorage.getItem('active_gradebook_username');
        if (savedUser) setActiveUser(savedUser);
      }
    });

    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
    script.async = true;
    script.onload = () => setLibLoaded(true);
    document.body.appendChild(script);

    return () => {
        unsubscribe();
        if(document.body.contains(script)) document.body.removeChild(script);
    };
  }, []);

  // --- 2. Data Sync Effect ---
  useEffect(() => {
    if (!firebaseUser || !activeUser) return;

    const studentsRef = getPublicCollection('students');
    const assignmentsRef = getPublicCollection('assignments');
    const gradesRef = getPublicCollection('grades');
    const settingsRef = getPublicDoc('settings', 'general');

    const handleSyncError = (context) => (err) => {
        console.error(`${context} Sync Error:`, err);
    };

    const unsubStudents = onSnapshot(studentsRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      data.sort((a, b) => a.name.localeCompare(b.name));
      setStudents(data);
    }, handleSyncError('Students'));

    const unsubAssignments = onSnapshot(assignmentsRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAssignments(data);
    }, handleSyncError('Assignments'));

    const unsubGrades = onSnapshot(gradesRef, (snapshot) => {
      const gradesMap = {};
      snapshot.docs.forEach(doc => {
        gradesMap[doc.id] = doc.data().score;
      });
      setGrades(gradesMap);
    }, handleSyncError('Grades'));

    const unsubSettings = onSnapshot(settingsRef, (docSnap) => {
      if (docSnap.exists() && docSnap.data().className) {
        setClassName(docSnap.data().className);
      } else {
        setClassName("My Gradebook"); 
      }
    }, handleSyncError('Settings'));

    return () => {
      unsubStudents();
      unsubAssignments();
      unsubGrades();
      unsubSettings();
    };
  }, [firebaseUser, activeUser]);

  // --- Handlers ---

  const ensureConnection = async () => {
      if (!auth.currentUser) {
          await signInAnonymously(auth);
      }
  };

  const handleLogin = async (username, pin) => {
    setLoginLoading(true);
    setAuthError("");

    try {
        await ensureConnection();
        const userDocRef = doc(db, 'artifacts', appId, 'public', 'data', 'app_users', username);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
            if (userDoc.data().pin === pin) {
                setActiveUser(username);
                localStorage.setItem('active_gradebook_username', username);
            } else {
                setAuthError("Incorrect PIN.");
            }
        } else {
            setAuthError("Username not found. Please create an account.");
        }
    } catch (err) {
        console.error(err);
        setAuthError("Login failed. Check your connection.");
    } finally {
        setLoginLoading(false);
    }
  };

  const handleRegister = async (username, pin) => {
    setLoginLoading(true);
    setAuthError("");

    try {
        await ensureConnection();
        const userDocRef = doc(db, 'artifacts', appId, 'public', 'data', 'app_users', username);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            setAuthError("Username already exists. Please choose another.");
        } else {
            await setDoc(userDocRef, {
                pin: pin,
                createdAt: new Date().toISOString()
            });
            setActiveUser(username);
            localStorage.setItem('active_gradebook_username', username);
        }
    } catch (err) {
        console.error(err);
        setAuthError("Registration failed. Please try again.");
    } finally {
        setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    setActiveUser(null);
    localStorage.removeItem('active_gradebook_username');
    setStudents([]);
    setAssignments([]);
    setGrades({});
  };

  const handleTitleSave = async (e) => {
    e.preventDefault();
    if (!activeUser) return;
    const newName = e.target.title.value;
    await setDoc(getPublicDoc('settings', 'general'), { className: newName }, { merge: true });
    setClassName(newName);
    setIsEditingTitle(false);
  };

  const addStudent = async (e) => {
    e.preventDefault();
    if (!activeUser) return;
    const formData = new FormData(e.target);
    const newId = `s${Date.now()}`;
    const newStudent = {
      name: formData.get('name'),
      studentId: formData.get('studentId'),
      rollNumber: formData.get('rollNumber') || '',
      className: formData.get('className') || ''
    };
    try {
      await setDoc(getPublicDoc('students', newId), newStudent);
      e.target.reset();
    } catch (err) { alert("Error adding student."); }
  };

  const removeStudent = async (id) => {
    if (!activeUser) return;
    if (confirm('Delete student and their grades?')) {
      try {
        await deleteDoc(getPublicDoc('students', id));
        const gradesToDelete = Object.keys(grades).filter(key => key.startsWith(`${id}-`));
        gradesToDelete.forEach(gradeKey => deleteDoc(getPublicDoc('grades', gradeKey)));
      } catch (err) { console.error("Error removing student:", err); }
    }
  };

  const addAssignment = async (e) => {
    e.preventDefault();
    if (!activeUser) return;
    const formData = new FormData(e.target);
    const newId = `a${Date.now()}`;
    const newAssignment = {
      name: formData.get('name'),
      maxPoints: Number(formData.get('maxPoints')),
      term: formData.get('term') 
    };
    try {
      await setDoc(getPublicDoc('assignments', newId), newAssignment);
      e.target.reset();
      setShowAddAssignmentModal(false);
    } catch (err) { alert("Error adding assignment."); }
  };

  const addStandardExams = async () => {
    if (!activeUser) return;
    if (!confirm("Add standard exams (UT1, SA1, UT2, SA2) to your list?")) return;

    const defaults = [
      { name: 'Exam Score', maxPoints: 40, term: 'UT1' },
      { name: 'Exam Score', maxPoints: 80, term: 'SA1' },
      { name: 'Exam Score', maxPoints: 40, term: 'UT2' },
      { name: 'Exam Score', maxPoints: 80, term: 'SA2' },
    ];

    try {
        const updates = defaults.map((def, idx) => {
            const exists = assignments.some(a => a.term === def.term && a.name === def.name);
            if (!exists) {
                const newId = `a_${Date.now()}_${idx}`;
                return setDoc(getPublicDoc('assignments', newId), def);
            }
            return Promise.resolve();
        });
        await Promise.all(updates);
        setShowAddAssignmentModal(false);
    } catch (err) {
        console.error("Error adding standard exams:", err);
        alert("Failed to add exams.");
    }
  };

  const removeAssignment = async (id) => {
    if (!activeUser) return;
    if (confirm('Delete assignment and all scores?')) {
      try {
        await deleteDoc(getPublicDoc('assignments', id));
        const gradesToDelete = Object.keys(grades).filter(key => key.endsWith(`-${id}`));
        gradesToDelete.forEach(gradeKey => deleteDoc(getPublicDoc('grades', gradeKey)));
      } catch (err) { console.error("Error removing assignment:", err); }
    }
  };

  const updateGrade = async (studentId, assignmentId, value) => {
    if (!activeUser) return;
    const gradeKey = `${studentId}-${assignmentId}`;
    const gradeRef = getPublicDoc('grades', gradeKey);
    try {
      if (value === '' || value === null) {
        await deleteDoc(gradeRef);
      } else {
        await setDoc(gradeRef, { score: Number(value), studentId, assignmentId });
      }
    } catch (err) { console.error("Error updating grade:", err); }
  };

  const updateMaxPoints = async (id, value) => {
    if (!activeUser) return;
    const numVal = Number(value);
    if(isNaN(numVal) || numVal < 0) return;
    
    try {
      await setDoc(getPublicDoc('assignments', id), { maxPoints: numVal }, { merge: true });
    } catch (err) { console.error("Error updating max points:", err); }
  };

  const processSheetData = async (rows) => {
    if (!activeUser || rows.length < 2) {
         alert("File appears empty.");
         return;
    }

    const originalHeaders = rows[0].map(h => String(h || "").trim());
    const headers = originalHeaders.map(h => h.toLowerCase().replace(/['"_\.\s]/g, ''));

    const idIndex = headers.findIndex(h => h.includes('admission') || (h.includes('student') && h.includes('id')) || h === 'id' || h.includes('reg'));
    const nameIndex = headers.findIndex(h => h.includes('name') || (h.includes('student') && !h.includes('id')));
    const classIndex = headers.findIndex(h => h.includes('class') || h.includes('standard') || h === 'grade' || h === 'sec');
    const rollIndex = headers.findIndex(h => h.includes('roll'));

    if (idIndex === -1 || nameIndex === -1) {
      alert(`Import Failed: Could not find 'Admission No' and 'Name' columns.`);
      return;
    }

    const metadataIndices = [idIndex, nameIndex, classIndex, rollIndex];
    const subjectIndices = headers.map((_, i) => i).filter(i => !metadataIndices.includes(i) && originalHeaders[i]);

    let studentsAdded = 0;
    const updates = [];
    const headerToAssignmentId = {};

    for (const index of subjectIndices) {
        const subjectName = originalHeaders[index];
        const normalizedName = subjectName.toLowerCase();
        
        let effectiveTerm = importTerm;
        if (normalizedName.includes('ut1')) effectiveTerm = 'UT1';
        else if (normalizedName.includes('sa1')) effectiveTerm = 'SA1';
        else if (normalizedName.includes('ut2')) effectiveTerm = 'UT2';
        else if (normalizedName.includes('sa2')) effectiveTerm = 'SA2';

        let assignmentId = assignments.find(a => 
            a.name.toLowerCase() === normalizedName && 
            a.term === effectiveTerm
        )?.id;

        if (!assignmentId) {
            const newId = `a${Date.now() + Math.random().toString().slice(2,8)}`;
            const newAssignment = { name: subjectName, maxPoints: 100, term: effectiveTerm };
            updates.push(setDoc(getPublicDoc('assignments', newId), newAssignment));
            assignmentId = newId;
        }
        headerToAssignmentId[index] = assignmentId;
    }

    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (!row[idIndex]) continue;

        const studentIdVal = String(row[idIndex]).trim();
        const name = row[nameIndex] ? String(row[nameIndex]).trim() : 'Unknown';
        const classNameRaw = classIndex !== -1 && row[classIndex] ? String(row[classIndex]).trim() : '';
        const rollNumber = rollIndex !== -1 && row[rollIndex] ? String(row[rollIndex]).trim() : '';

        const className = classNameRaw || (selectedClass !== 'All' ? selectedClass : '');

        let student = students.find(s => s.studentId === studentIdVal);
        let studentDbId = student ? student.id : `s${Date.now() + i}`;

        const studentData = {
            name: (name && name.length > (student?.name?.length || 0)) ? name : (student?.name || name),
            studentId: studentIdVal,
            className: className || student?.className || '',
            rollNumber: rollNumber || student?.rollNumber || ''
        };

        updates.push(setDoc(getPublicDoc('students', studentDbId), studentData));
        if (!student) studentsAdded++;

        subjectIndices.forEach(colIndex => {
            const val = row[colIndex];
            const assignmentId = headerToAssignmentId[colIndex];
            if (assignmentId && val !== undefined && val !== null && val !== '') {
                const numVal = Number(val);
                if (!isNaN(numVal)) {
                     const gradeKey = `${studentDbId}-${assignmentId}`;
                     updates.push(setDoc(getPublicDoc('grades', gradeKey), {
                        score: numVal,
                        studentId: studentDbId,
                        assignmentId
                    }));
                }
            }
        });
    }

    try {
        await Promise.all(updates);
        alert(`Import Successful! ${studentsAdded} students processed.`);
    } catch (err) {
        console.error(err);
        alert("Error saving imported data.");
    }
    
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileUpload = (e) => {
    if (!libLoaded) { alert("Parser loading..."); return; }
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
        try {
            const data = new Uint8Array(evt.target.result);
            const workbook = window.XLSX.read(data, { type: 'array' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = window.XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            processSheetData(jsonData);
        } catch (err) { alert("Failed to parse file."); }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleImportClick = () => fileInputRef.current?.click();

  const getStudentStats = (studentId) => {
    let earned = 0;
    let totalPossible = 0;
    assignments.forEach(a => {
      const key = `${studentId}-${a.id}`;
      if (grades[key] !== undefined) {
        earned += grades[key];
        totalPossible += a.maxPoints;
      }
    });
    const percentage = totalPossible === 0 ? 0 : (earned / totalPossible) * 100;
    return { earned, totalPossible, percentage };
  };

  const exportToCSV = (termToExport = 'All') => {
    let headers = ['Admission No', 'Class', 'Name', 'Roll Number'];
    const termsToInclude = termToExport === 'All' ? Object.keys(assignmentsByTerm).sort((a,b) => {
        const orderA = TERM_ORDER.indexOf(a) !== -1 ? TERM_ORDER.indexOf(a) : 99;
        const orderB = TERM_ORDER.indexOf(b) !== -1 ? TERM_ORDER.indexOf(b) : 99;
        return orderA - orderB;
    }) : [termToExport];

    termsToInclude.forEach(term => {
        if(assignmentsByTerm[term]) {
            headers.push(...assignmentsByTerm[term].map(a => `${term} - ${a.name} (${a.maxPoints})`));
            headers.push(`${term} Total`);
        }
    });
    
    if(termToExport === 'All') {
        headers.push('Grand Total %');
    }

    const rows = filteredStudents.map(s => {
      const rowData = [`"${s.studentId}"`, `"${s.className || ''}"`, `"${s.name}"`, `"${s.rollNumber || ''}"`];
      let grandTotalEarned = 0;
      let grandTotalMax = 0;

      termsToInclude.forEach(term => {
          let termEarned = 0;
          if(assignmentsByTerm[term]) {
              assignmentsByTerm[term].forEach(a => {
                  const score = grades[`${s.id}-${a.id}`];
                  rowData.push(score ?? '');
                  if (score !== undefined) {
                      termEarned += score;
                      grandTotalEarned += score;
                      grandTotalMax += a.maxPoints;
                  }
              });
              rowData.push(termEarned);
          }
      });

      if(termToExport === 'All') {
          const percentage = grandTotalMax === 0 ? 0 : (grandTotalEarned / grandTotalMax) * 100;
          rowData.push(percentage.toFixed(2));
      }
      
      return rowData.join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    const classSuffix = selectedClass !== 'All' ? `_${selectedClass}` : '';
    const termSuffix = termToExport !== 'All' ? `_${termToExport}` : '';
    const safeName = className.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    link.download = `${safeName}${classSuffix}${termSuffix}_export.csv`;
    link.click();
    setShowExportMenu(false);
  };

  // --- Views ---

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-900" />
      </div>
    );
  }

  if (!activeUser || !firebaseUser) {
    return (
      <AuthScreen 
        onLogin={handleLogin}
        onRegister={handleRegister} 
        error={authError} 
        isLoading={loginLoading}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              {isEditingTitle ? (
                <form onSubmit={handleTitleSave} className="flex items-center">
                  <input 
                    name="title" 
                    defaultValue={className} 
                    autoFocus
                    onBlur={() => setIsEditingTitle(false)}
                    className="text-xl font-bold text-indigo-900 border-b-2 border-indigo-500 outline-none bg-transparent"
                  />
                  <button type="submit" className="ml-2 text-green-600"><Check className="w-5 h-5" /></button>
                </form>
              ) : (
                <div className="group flex items-center gap-2 cursor-pointer" onClick={() => setIsEditingTitle(true)}>
                  <h1 className="text-xl font-bold text-slate-800">
                    {className}
                  </h1>
                  <Edit3 className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              )}
               <div className="flex items-center gap-1.5 mt-0.5">
                  <ShieldCheck className="w-3 h-3 text-emerald-500" />
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                    User: {activeUser}
                  </span>
               </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 mr-2 bg-slate-100 p-1 rounded-lg">
                <div className="px-2 text-xs font-bold text-slate-500 flex items-center gap-1">
                    <Filter className="w-3 h-3" /> Class:
                </div>
                <select 
                    value={selectedClass} 
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="bg-white text-sm border-none rounded px-2 py-1 focus:ring-0 cursor-pointer"
                >
                    {classes.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>

            <nav className="hidden md:flex bg-slate-100 p-1 rounded-lg">
              {[
                { id: 'students', icon: Users, label: 'Students' },
                { id: 'grades', icon: Calculator, label: 'Gradebook' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === tab.id 
                      ? 'bg-white text-indigo-700 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </nav>
            <button onClick={handleLogout} className="text-slate-400 hover:text-red-600 transition-colors" title="Sign Out">
                <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="md:hidden border-t border-slate-100 p-2 flex justify-around">
            {[
                { id: 'students', icon: Users, label: 'Students' },
                { id: 'grades', icon: Calculator, label: 'Gradebook' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center gap-1 px-4 py-2 rounded-md text-xs font-medium ${
                    activeTab === tab.id ? 'text-indigo-700' : 'text-slate-500'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
            ))}
        </div>
      </header>

      {/* Add Assignment Modal */}
      {showAddAssignmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800">Add New Assignment</h3>
                    <button onClick={() => setShowAddAssignmentModal(false)} className="text-slate-400 hover:text-slate-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6">
                    <form onSubmit={addAssignment} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">Assignment Name</label>
                            <input required name="name" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. Unit Test 1" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Max Points</label>
                                <input required name="maxPoints" type="number" min="1" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="100" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Term</label>
                                <select name="term" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
                                    <option value="UT1">UT1</option>
                                    <option value="SA1">SA1</option>
                                    <option value="UT2">UT2</option>
                                    <option value="SA2">SA2</option>
                                </select>
                            </div>
                        </div>
                        
                        <div className="pt-4 flex gap-3">
                            <button 
                                type="button" 
                                onClick={addStandardExams}
                                className="flex-1 flex items-center justify-center gap-2 py-2 border border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg font-medium transition-colors text-sm"
                            >
                                <Calendar className="w-4 h-4" /> Add Standard Set
                            </button>
                            <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium shadow-sm transition-colors text-sm">
                                Create
                            </button>
                        </div>
                        <p className="text-xs text-center text-slate-400 mt-2">Standard Set adds UT1, SA1, UT2, SA2 exams automatically.</p>
                    </form>
                </div>
            </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === 'students' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                    <h3 className="text-lg font-semibold text-slate-800 flex items-center">
                    <Plus className="w-5 h-5 mr-2 text-indigo-700" /> Add New Student
                    </h3>
                    <div className="flex gap-2">
                        {/* Term Selection for Import */}
                        <select 
                            value={importTerm} 
                            onChange={(e) => setImportTerm(e.target.value)}
                            className="bg-slate-100 text-slate-700 text-sm border-none rounded-lg px-3 py-2 font-medium cursor-pointer focus:ring-2 focus:ring-indigo-500 outline-none"
                            title="Select Term for new assignments found in import"
                        >
                            <option value="UT1">Import to UT1</option>
                            <option value="SA1">Import to SA1</option>
                            <option value="UT2">Import to UT2</option>
                            <option value="SA2">Import to SA2</option>
                        </select>

                        <input type="file" accept=".csv, .xlsx, .xls" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
                        <button onClick={handleImportClick} className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors">
                            <Upload className="w-4 h-4" /> Import Excel/CSV
                        </button>
                    </div>
                </div>

                <form onSubmit={addStudent} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div className="md:col-span-1">
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Admission No</label>
                    <input required name="studentId" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. 1001" />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Name</label>
                    <input required name="name" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. Jane Doe" />
                  </div>
                  <div className="md:col-span-1 grid grid-cols-2 gap-2">
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Class</label>
                        <input 
                            name="className" 
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none" 
                            placeholder="10-A"
                            defaultValue={selectedClass !== 'All' ? selectedClass : ''}
                        />
                    </div>
                    <div><label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Roll No</label><input name="rollNumber" className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none" placeholder="01" /></div>
                  </div>
                  <div className="md:col-span-1"><button type="submit" className="w-full bg-indigo-700 hover:bg-indigo-800 text-white px-4 py-2 rounded-lg font-medium shadow-sm h-[42px]">Add Student</button></div>
                </form>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                  <h3 className="font-semibold text-slate-800">
                    {selectedClass === 'All' ? 'All Students' : `Class ${selectedClass}`} ({filteredStudents.length})
                  </h3>
                </div>
                <div className="divide-y divide-slate-100">
                  {filteredStudents.length === 0 ? <div className="p-8 text-center text-slate-500 italic">No students found for this class.</div> : filteredStudents.map(student => (
                      <div key={student.id} className="px-6 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">{student.name.charAt(0)}</div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-1">
                            <div className="font-medium text-slate-900 col-span-full md:col-span-1">{student.name}</div>
                            <div className="text-sm text-slate-500 flex items-center gap-2"><span className="text-xs font-bold bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">ID</span>{student.studentId}</div>
                             <div className="text-sm text-slate-500 flex items-center gap-4">
                                {student.className && <span className="flex items-center gap-1"><span className="text-xs font-bold bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">Class</span>{student.className}</span>}
                                 {student.rollNumber && <span className="flex items-center gap-1"><span className="text-xs font-bold bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">Roll</span>{student.rollNumber}</span>}
                            </div>
                          </div>
                        </div>
                        <button onClick={() => removeStudent(student.id)} className="text-slate-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"><Trash2 className="w-5 h-5" /></button>
                      </div>
                    ))}
                </div>
              </div>
            </div>
        )}

        {activeTab === 'grades' && (
             <div className="space-y-4 animate-fadeIn">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-sm text-slate-500"><span className="font-medium text-slate-900">{filteredStudents.length}</span> students in {selectedClass} &bull; <span className="font-medium text-slate-900">{assignments.length}</span> assignments</div>
                  
                  <div className="flex gap-2">
                      {/* ADD ASSIGNMENT BUTTON */}
                      <button 
                        onClick={() => setShowAddAssignmentModal(true)}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium text-sm shadow-sm transition-colors"
                      >
                        <Plus className="w-4 h-4" /> Add Assignment
                      </button>

                      {/* Enhanced Export Menu */}
                      <div className="relative">
                          <button 
                            onClick={() => setShowExportMenu(!showExportMenu)}
                            className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg font-medium text-sm shadow-sm transition-colors"
                          >
                            <Download className="w-4 h-4" /> Export
                            <ChevronDown className="w-3 h-3 ml-1" />
                          </button>
                          
                          {showExportMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-200 z-50 overflow-hidden">
                                <div className="py-1">
                                    <button onClick={() => exportToCSV('All')} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-green-700">Full Report</button>
                                    <div className="border-t border-slate-100 my-1"></div>
                                    <div className="px-4 py-1 text-xs font-semibold text-slate-400 uppercase">Per Term</div>
                                    <button onClick={() => exportToCSV('UT1')} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-green-700">Export UT1 Only</button>
                                    <button onClick={() => exportToCSV('SA1')} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-green-700">Export SA1 Only</button>
                                    <button onClick={() => exportToCSV('UT2')} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-green-700">Export UT2 Only</button>
                                    <button onClick={() => exportToCSV('SA2')} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-green-700">Export SA2 Only</button>
                                </div>
                            </div>
                          )}
                          
                          {/* Overlay to close menu */}
                          {showExportMenu && (
                            <div className="fixed inset-0 z-40" onClick={() => setShowExportMenu(false)}></div>
                          )}
                      </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto pb-4">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        <th className="p-4 min-w-[200px] sticky left-0 bg-slate-50 z-10 border-r border-slate-200">Student Details</th>
                        {/* Only map known terms first for consistent order */}
                        {TERM_ORDER.map(term => {
                            if (!assignmentsByTerm[term] || assignmentsByTerm[term].length === 0) return null;
                            return (
                            <React.Fragment key={term}>
                                {assignmentsByTerm[term].map(a => (
                                    <th key={a.id} className="p-4 min-w-[100px] text-center bg-white border-l border-slate-100 group relative">
                                        <div className="flex justify-between items-start">
                                            <div className="truncate max-w-[80px]" title={a.name}>{a.name}</div>
                                            <button onClick={() => removeAssignment(a.id)} className="text-slate-200 hover:text-red-500"><X className="w-3 h-3" /></button>
                                        </div>
                                        <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 mt-1">
                                            <span>/</span>
                                            <input 
                                                className="w-8 bg-transparent border-b border-slate-300 focus:border-indigo-500 outline-none text-center"
                                                defaultValue={a.maxPoints}
                                                onBlur={(e) => updateMaxPoints(a.id, e.target.value)}
                                            />
                                        </div>
                                    </th>
                                ))}
                                <th className="p-4 min-w-[80px] text-center bg-slate-50 border-l border-slate-200 text-slate-700 font-bold">
                                    {term} Total
                                </th>
                            </React.Fragment>
                            );
                        })}
                        {/* Then handle Other */}
                        {assignmentsByTerm['Other'] && assignmentsByTerm['Other'].length > 0 && (
                            <React.Fragment>
                                {assignmentsByTerm['Other'].map(a => (
                                    <th key={a.id} className="p-4 min-w-[100px] text-center bg-white border-l border-slate-100">
                                        <div className="flex justify-between items-start">
                                            <div className="truncate max-w-[80px]" title={a.name}>{a.name}</div>
                                            <button onClick={() => removeAssignment(a.id)} className="text-slate-200 hover:text-red-500"><X className="w-3 h-3" /></button>
                                        </div>
                                        <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 mt-1">
                                            <span>/</span>
                                            <input 
                                                className="w-8 bg-transparent border-b border-slate-300 focus:border-indigo-500 outline-none text-center"
                                                defaultValue={a.maxPoints}
                                                onBlur={(e) => updateMaxPoints(a.id, e.target.value)}
                                            />
                                        </div>
                                    </th>
                                ))}
                                <th className="p-4 min-w-[80px] text-center bg-slate-50 border-l border-slate-200 text-slate-700 font-bold">
                                    Other Total
                                </th>
                            </React.Fragment>
                        )}
                        <th className="p-4 min-w-[100px] text-center bg-indigo-50 border-l-2 border-indigo-100 text-indigo-700 font-bold">Final %</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {filteredStudents.map(student => {
                        const stats = getStudentStats(student.id);
                        return (
                          <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                            <td className="p-4 font-medium text-slate-900 sticky left-0 bg-white group-hover:bg-slate-50 border-r border-slate-200 z-10">
                              <div className="flex flex-col gap-1"><span className="text-base">{student.name}</span><div className="flex flex-wrap gap-2 text-xs text-slate-500 font-normal"><span className="bg-slate-100 px-1 rounded">ID: {student.studentId}</span></div></div>
                            </td>
                            
                            {/* Force specific order for data cells too */}
                            {TERM_ORDER.map(term => {
                                if (!assignmentsByTerm[term] || assignmentsByTerm[term].length === 0) return null;
                                let termTotal = 0;
                                return (
                                    <React.Fragment key={term}>
                                        {assignmentsByTerm[term].map(a => {
                                            const score = grades[`${student.id}-${a.id}`];
                                            if(score) termTotal += score;
                                            return (
                                                <td key={a.id} className="p-2 text-center border-l border-slate-100">
                                                <input type="number" min="0" max={a.maxPoints} value={score ?? ''} onChange={(e) => updateGrade(student.id, a.id, e.target.value)} className={`w-16 text-center py-1 px-1 rounded border focus:ring-1 outline-none text-xs ${score > a.maxPoints ? 'border-red-300 bg-red-50 text-red-700' : 'border-slate-200 focus:border-indigo-500'}`} placeholder="-" />
                                                </td>
                                            );
                                        })}
                                        <td className="p-2 text-center font-bold text-slate-700 bg-slate-50 border-l border-slate-200">
                                            {termTotal}
                                        </td>
                                    </React.Fragment>
                                );
                            })}

                            {/* Handle Other cells */}
                            {assignmentsByTerm['Other'] && assignmentsByTerm['Other'].length > 0 && (
                                <React.Fragment>
                                    {assignmentsByTerm['Other'].map(a => {
                                        const score = grades[`${student.id}-${a.id}`];
                                        return (
                                            <td key={a.id} className="p-2 text-center border-l border-slate-100">
                                            <input type="number" min="0" max={a.maxPoints} value={score ?? ''} onChange={(e) => updateGrade(student.id, a.id, e.target.value)} className={`w-16 text-center py-1 px-1 rounded border focus:ring-1 outline-none text-xs ${score > a.maxPoints ? 'border-red-300 bg-red-50 text-red-700' : 'border-slate-200 focus:border-indigo-500'}`} placeholder="-" />
                                            </td>
                                        );
                                    })}
                                    {/* Simplified total for Other */}
                                    <td className="p-2 text-center font-bold text-slate-700 bg-slate-50 border-l border-slate-200">-</td>
                                </React.Fragment>
                            )}

                            <td className="p-4 text-center font-bold text-indigo-700 bg-indigo-50 border-l-2 border-indigo-100">
                                {stats.percentage.toFixed(1)}%
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
            </div>
        )}
      </main>
    </div>
  );
}