export interface PracticeQuestion {
  id: string;
  question: string;
  type: 'mcq' | 'assertion-reason' | 'short-answer' | 'numerical';
  options?: string[];
  correctAnswer: number | string; // index for MCQ or string
  explanation: string;
  boardYear?: string; // e.g. "CBSE 2024", "Exemplar"
  marks: number;
}

export interface ChapterTest {
  id: string;
  classGrade: string;
  subject: string;
  chapter: string;
  title: string;
  durationMinutes: number;
  totalMarks: number;
  difficulty: 'Board Standard' | 'Exemplar High' | 'Conceptual Foundation';
  questions: PracticeQuestion[];
}

export const CHAPTER_TESTS_CATALOG: ChapterTest[] = [
  // Class 11 Physics
  {
    id: 'test-11-phy-lom',
    classGrade: 'Class 11',
    subject: 'Physics',
    chapter: 'Laws of Motion',
    title: 'Laws of Motion & Friction Board Test',
    durationMinutes: 25,
    totalMarks: 20,
    difficulty: 'Board Standard',
    questions: [
      {
        id: 'q1',
        question: 'A mass of 2 kg is placed on a rough horizontal surface with coefficient of static friction μ_s = 0.4. What is the minimum horizontal force required to start moving the object? (Take g = 9.8 m/s²)',
        type: 'mcq',
        options: ['4.9 N', '7.84 N', '9.8 N', '19.6 N'],
        correctAnswer: 1,
        explanation: 'F_limiting = μ_s × N = μ_s × m × g = 0.4 × 2 × 9.8 = 7.84 N.',
        boardYear: 'CBSE 2023',
        marks: 2,
      },
      {
        id: 'q2',
        question: 'Assertion (A): On a banked road without friction, a vehicle can negotiate a curve of radius r safely at a specific design speed v = √(r·g·tan θ).\nReason (R): The horizontal component of normal contact force N sin θ provides the necessary centripetal force.',
        type: 'mcq',
        options: [
          'Both A and R are true, and R is the correct explanation of A',
          'Both A and R are true, but R is NOT the correct explanation of A',
          'A is true but R is false',
          'A is false but R is true'
        ],
        correctAnswer: 0,
        explanation: 'For a frictionless banked road, N cos θ = mg and N sin θ = m(v²/r). Dividing gives tan θ = v² / (rg), so v = √(rg tan θ).',
        boardYear: 'CBSE 2024 Sample Paper',
        marks: 3,
      },
      {
        id: 'q3',
        question: 'State Newton\'s Second Law in terms of momentum rate of change, and derive F = ma for constant mass system.',
        type: 'short-answer',
        correctAnswer: 'F = dp/dt = d(mv)/dt = m(dv/dt) = ma (when m is constant)',
        explanation: 'The rate of change of linear momentum of an object is directly proportional to the applied external net force and occurs in the direction of the force: F = dp/dt. Since p = mv, F = d(mv)/dt = m(dv/dt) = ma for constant mass.',
        boardYear: 'NCERT Core Derivation',
        marks: 3,
      },
      {
        id: 'q4',
        question: 'Why does an athlete run a certain distance before taking a long jump?',
        type: 'mcq',
        options: [
          'To overcome gravity',
          'To acquire inertia of motion',
          'To reduce friction with the ground',
          'To increase reaction time'
        ],
        correctAnswer: 1,
        explanation: 'By running beforehand, the athlete acquires inertia of motion, which helps them jump a greater distance once airborne.',
        boardYear: 'CBSE Board Question',
        marks: 2,
      },
      {
        id: 'q5',
        question: 'A rocket of initial mass 6000 kg ejects gas at a constant relative velocity of 1000 m/s. What rate of gas ejection is required to impart an initial upward acceleration of 19.6 m/s²? (g = 9.8 m/s²)',
        type: 'mcq',
        options: ['120 kg/s', '176.4 kg/s', '180 kg/s', '240 kg/s'],
        correctAnswer: 1,
        explanation: 'Thrust F = u(dm/dt) = m(a + g) = 6000 × (19.6 + 9.8) = 6000 × 29.4 = 176,400 N. Thus dm/dt = 176,400 / 1000 = 176.4 kg/s.',
        boardYear: 'NCERT Exemplar Problem',
        marks: 4,
      }
    ]
  },

  // Class 11 Chemistry
  {
    id: 'test-11-chem-bonding',
    classGrade: 'Class 11',
    subject: 'Chemistry',
    chapter: 'Chemical Bonding and Molecular Structure',
    title: 'VSEPR Theory & Hybridisation Mastery Test',
    durationMinutes: 20,
    totalMarks: 15,
    difficulty: 'Board Standard',
    questions: [
      {
        id: 'q1',
        question: 'What is the geometry and hybridisation state of the central phosphorus atom in PCl₅ in the gas phase?',
        type: 'mcq',
        options: [
          'Square planar, dsp²',
          'Trigonal bipyramidal, sp³d',
          'Octahedral, sp³d²',
          'Tetrahedral, sp³'
        ],
        correctAnswer: 1,
        explanation: 'P has 5 valence electrons and forms 5 single bonds with chlorine. Steric number = 5, giving sp³d hybridisation and trigonal bipyramidal geometry.',
        boardYear: 'CBSE 2023',
        marks: 2,
      },
      {
        id: 'q2',
        question: 'Why are axial bonds in PCl₅ longer than equatorial bonds?',
        type: 'mcq',
        options: [
          'Axial bond pairs experience greater repulsion from 3 equatorial bond pairs at 90°',
          'Equatorial bonds are ionic while axial are covalent',
          'Axial chlorines have higher electronegativity',
          'Phosphorus d-orbitals are only used in equatorial bonds'
        ],
        correctAnswer: 0,
        explanation: 'Each axial P-Cl bond pair experiences 3 bond pair-bond pair repulsions at 90°, whereas equatorial pairs only experience 2 repulsions at 90°. To minimize repulsion, axial bonds are longer and weaker.',
        boardYear: 'NCERT Intext Question',
        marks: 3,
      },
      {
        id: 'q3',
        question: 'According to Molecular Orbital Theory, what is the magnetic behavior of O₂ molecule?',
        type: 'mcq',
        options: [
          'Diamagnetic with zero unpaired electrons',
          'Paramagnetic with two unpaired electrons in π* antibonding orbitals',
          'Ferromagnetic at room temperature',
          'Diamagnetic with bond order 3'
        ],
        correctAnswer: 1,
        explanation: 'In O₂, electronic configuration ends in (π*2px)¹ (π*2py)¹. The two unpaired electrons in degenerate antibonding π* orbitals make oxygen paramagnetic with bond order 2.',
        boardYear: 'CBSE 2022 / Exemplar',
        marks: 3,
      },
      {
        id: 'q4',
        question: 'Which of the following molecules has zero dipole moment despite polar covalent bonds?',
        type: 'mcq',
        options: ['NH₃', 'NF₃', 'BF₃', 'H₂O'],
        correctAnswer: 2,
        explanation: 'BF₃ is symmetrical trigonal planar (bond angles 120°). The three equal B-F bond dipoles cancel out symmetrically, giving net dipole moment μ = 0.',
        boardYear: 'CBSE 2024',
        marks: 2,
      }
    ]
  },

  // Class 11 Biology
  {
    id: 'test-11-bio-cell',
    classGrade: 'Class 11',
    subject: 'Biology',
    chapter: 'Cell: The Unit of Life',
    title: 'Cell Organelles & Fluid Mosaic Model Exam',
    durationMinutes: 20,
    totalMarks: 15,
    difficulty: 'Board Standard',
    questions: [
      {
        id: 'q1',
        question: 'Who proposed the widely accepted Fluid Mosaic Model of cell membrane in 1972?',
        type: 'mcq',
        options: [
          'Robert Hooke and Anton van Leeuwenhoek',
          'Singer and Nicolson',
          'Schleiden and Schwann',
          'Camillo Golgi'
        ],
        correctAnswer: 1,
        explanation: 'Singer and Nicolson proposed the Fluid Mosaic Model in 1972, describing membranes as a quasifluid bilayer of lipids with embedded mosaic proteins.',
        boardYear: 'NCERT Direct',
        marks: 2,
      },
      {
        id: 'q2',
        question: 'Which organelle is considered the "protein factory" and lacks any surrounding membrane?',
        type: 'mcq',
        options: ['Lysosome', 'Ribosome', 'Peroxisome', 'Golgi apparatus'],
        correctAnswer: 1,
        explanation: 'Ribosomes (70S in prokaryotes, 80S in eukaryotes) are non-membrane-bound granular ribonucleoprotein complexes that synthesize proteins.',
        boardYear: 'CBSE 2023',
        marks: 2,
      },
      {
        id: 'q3',
        question: 'Match the cellular structure with its distinctive feature:\nA. Chloroplast - (i) Cristae\nB. Mitochondria - (ii) Thylakoids & Stroma\nC. Centriole - (iii) 9+0 cartwheel microtubule arrangement',
        type: 'mcq',
        options: [
          'A-(ii), B-(i), C-(iii)',
          'A-(i), B-(ii), C-(iii)',
          'A-(iii), B-(ii), C-(i)',
          'A-(ii), B-(iii), C-(i)'
        ],
        correctAnswer: 0,
        explanation: 'Chloroplasts contain grana/thylakoids in stroma; mitochondria have inner foldings called cristae; centrioles exhibit 9+0 triplet microtubular hub-and-spoke organization.',
        boardYear: 'NEET / CBSE Exemplar',
        marks: 3,
      }
    ]
  },

  // Class 10 Science
  {
    id: 'test-10-sci-life',
    classGrade: 'Class 10',
    subject: 'Science',
    chapter: 'Life Processes',
    title: 'Class 10 Board Test: Life Processes',
    durationMinutes: 25,
    totalMarks: 20,
    difficulty: 'Board Standard',
    questions: [
      {
        id: 'q1',
        question: 'What is the function of the bile juice secreted by the liver in human digestion?',
        type: 'mcq',
        options: [
          'To break proteins into amino acids',
          'To emulsify large fat globules and create an alkaline medium for pancreatic lipase',
          'To hydrolyze starch into maltose',
          'To kill bacteria using concentrated hydrochloric acid'
        ],
        correctAnswer: 1,
        explanation: 'Bile salts emulsify large fat droplets into smaller micelles, greatly increasing the surface area for lipase action, and provide an alkaline pH required by pancreatic enzymes.',
        boardYear: 'CBSE Board 2024',
        marks: 3,
      },
      {
        id: 'q2',
        question: 'Which chamber of the human heart receives oxygen-rich blood from the lungs via pulmonary veins?',
        type: 'mcq',
        options: ['Right Atrium', 'Right Ventricle', 'Left Atrium', 'Left Ventricle'],
        correctAnswer: 2,
        explanation: 'Oxygenated blood from the lungs enters the Left Atrium through the pulmonary veins.',
        boardYear: 'CBSE Board 2023',
        marks: 2,
      },
      {
        id: 'q3',
        question: 'The filtration units of kidneys are called:',
        type: 'mcq',
        options: ['Alveoli', 'Neurons', 'Nephrons', 'Villi'],
        correctAnswer: 2,
        explanation: 'Nephrons are the functional structural and filtration units of the kidney composed of Bowman\'s capsule, glomerulus, and renal tubules.',
        boardYear: 'CBSE Board 2023',
        marks: 2,
      }
    ]
  },

  // Class 9 Science
  {
    id: 'test-9-sci-cell',
    classGrade: 'Class 9',
    subject: 'Science',
    chapter: 'The Fundamental Unit of Life: Cell',
    title: 'Class 9 Science: Cell Chapter Test',
    durationMinutes: 20,
    totalMarks: 15,
    difficulty: 'Board Standard',
    questions: [
      {
        id: 'q1',
        question: 'A cell placed in a hypotonic solution will:',
        type: 'mcq',
        options: [
          'Shrink due to exosmosis',
          'Swell up due to endosmosis and may burst if animal cell',
          'Remain identical in size',
          'Undergo plasmolysis immediately'
        ],
        correctAnswer: 1,
        explanation: 'In a hypotonic solution (higher water concentration outside), water enters the cell via endosmosis, causing it to swell.',
        boardYear: 'NCERT Intext',
        marks: 2,
      },
      {
        id: 'q2',
        question: 'Why are lysosomes called the "suicide bags" of a cell?',
        type: 'mcq',
        options: [
          'They manufacture suicidal toxins for bacteria',
          'When cell gets damaged, lysosomes burst and digestive enzymes hydrolyze the cell itself',
          'They lack membranes and decompose during division',
          'They prevent mitosis'
        ],
        correctAnswer: 1,
        explanation: 'Lysosomes contain powerful hydrolytic enzymes. If the cell metabolism gets disturbed, lysosomes burst and enzymes digest the cell itself.',
        boardYear: 'NCERT Core',
        marks: 3,
      }
    ]
  },

  // Class 12 Physics
  {
    id: 'test-12-phy-charges',
    classGrade: 'Class 12',
    subject: 'Physics',
    chapter: 'Electric Charges and Fields',
    title: 'Electrostatics & Gauss\'s Law Board Assessment',
    durationMinutes: 30,
    totalMarks: 20,
    difficulty: 'Board Standard',
    questions: [
      {
        id: 'q1',
        question: 'Two point charges +q and +4q are separated by distance r. At what point on the line joining them is the net electric field zero?',
        type: 'mcq',
        options: [
          'r/2 from charge +q',
          'r/3 from charge +q',
          'r/4 from charge +q',
          '2r/3 from charge +q'
        ],
        correctAnswer: 1,
        explanation: 'For equilibrium between like charges, E₁ = E₂ => k·q / x² = k·(4q) / (r - x)². Taking square roots: 1/x = 2/(r - x) => r - x = 2x => 3x = r => x = r/3 from +q.',
        boardYear: 'CBSE Board 2024',
        marks: 3,
      },
      {
        id: 'q2',
        question: 'According to Gauss\'s Law, the total electric flux through a closed Gaussian surface enclosing a dipole of charges +q and -q is:',
        type: 'mcq',
        options: [
          'q / ε₀',
          '2q / ε₀',
          'Zero',
          '-q / ε₀'
        ],
        correctAnswer: 2,
        explanation: 'Gauss\'s law states Φ = Q_enclosed / ε₀. For an electric dipole, Q_enclosed = (+q) + (-q) = 0, so the net electric flux through the enclosing surface is zero.',
        boardYear: 'CBSE Board 2023',
        marks: 2,
      },
      {
        id: 'q3',
        question: 'An electric dipole of dipole moment p is placed in a uniform electric field E. What is the orientation of the dipole for stable equilibrium and the corresponding potential energy?',
        type: 'mcq',
        options: [
          'θ = 0° (aligned with E), U = -pE',
          'θ = 180° (anti-aligned with E), U = +pE',
          'θ = 90° (perpendicular), U = 0',
          'θ = 45°, U = -pE / √2'
        ],
        correctAnswer: 0,
        explanation: 'Torque τ = p × E = pE sin θ. At θ = 0°, torque is zero and potential energy U = -p·E = -pE cos 0° = -pE, which is minimum (stable equilibrium).',
        boardYear: 'NCERT Exemplar',
        marks: 3,
      }
    ]
  },

  // Class 12 Chemistry
  {
    id: 'test-12-chem-solutions',
    classGrade: 'Class 12',
    subject: 'Chemistry',
    chapter: 'Solutions',
    title: 'Colligative Properties & Raoult\'s Law Exam',
    durationMinutes: 25,
    totalMarks: 18,
    difficulty: 'Board Standard',
    questions: [
      {
        id: 'q1',
        question: 'Which of the following aqueous solutions exhibits the highest boiling point elevation?',
        type: 'mcq',
        options: [
          '0.1 M Glucose (C₆H₁₂O₆)',
          '0.1 M NaCl',
          '0.1 M CaCl₂',
          '0.1 M AlCl₃'
        ],
        correctAnswer: 3,
        explanation: 'ΔT_b = i × K_b × m. AlCl₃ dissociates into 4 ions (Al³⁺ + 3Cl⁻), giving van \'t Hoff factor i = 4. Higher i produces the greatest boiling point elevation.',
        boardYear: 'CBSE Board 2024',
        marks: 3,
      },
      {
        id: 'q2',
        question: 'State the condition for a solution of chloroform and acetone showing negative deviation from Raoult\'s law:',
        type: 'mcq',
        options: [
          'A-B intermolecular hydrogen bonding is stronger than A-A and B-B interactions',
          'A-B interactions are much weaker than pure solute-solute interactions',
          'Enthalpy of mixing ΔH_mix is positive',
          'Volume of mixing ΔV_mix is positive'
        ],
        correctAnswer: 0,
        explanation: 'Chloroform and acetone form intermolecular hydrogen bonds between the hydrogen of chloroform and the oxygen of acetone. A-B attractive forces exceed A-A and B-B forces, leading to negative deviation with ΔH_mix < 0 and ΔV_mix < 0.',
        boardYear: 'NCERT Intext Question',
        marks: 3,
      }
    ]
  },

  // Class 10 Science - Light
  {
    id: 'test-10-sci-light',
    classGrade: 'Class 10',
    subject: 'Science',
    chapter: 'Light – Reflection and Refraction',
    title: 'Optics, Mirrors & Lenses Board Test',
    durationMinutes: 25,
    totalMarks: 15,
    difficulty: 'Board Standard',
    questions: [
      {
        id: 'q1',
        question: 'A convex lens of focal length 15 cm forms a real image at a distance of 30 cm from the lens. What is the distance of the object from the lens?',
        type: 'mcq',
        options: ['-15 cm', '-30 cm', '+30 cm', '-10 cm'],
        correctAnswer: 1,
        explanation: 'Using lens formula: 1/f = 1/v - 1/u => 1/15 = 1/30 - 1/u => 1/u = 1/30 - 1/15 = -1/30 => u = -30 cm (placed at 2F₁).',
        boardYear: 'CBSE Board 2023',
        marks: 3,
      },
      {
        id: 'q2',
        question: 'Why are convex mirrors preferred as rear-view mirrors in automobiles?',
        type: 'mcq',
        options: [
          'They produce magnified real images',
          'They always form an erect, diminished image and give a wider field of view',
          'They have zero spherical aberration',
          'They reflect all colors equally'
        ],
        correctAnswer: 1,
        explanation: 'Convex mirrors always produce an erect, virtual, and diminished image of objects behind, and being curved outward, they provide a much wider field of view for the driver.',
        boardYear: 'CBSE Board 2024',
        marks: 2,
      }
    ]
  }
];
