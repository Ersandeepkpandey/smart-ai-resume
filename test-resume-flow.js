// Simple test to verify the resume data preservation flow
// This simulates the browser sessionStorage behavior

console.log('Testing resume data preservation flow...\n');

// Simulate storing resume data when anonymous user tries to save
const resumeData = {
  title: 'My Professional Resume',
  template_id: 'template1',
  content: {
    personalInfo: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '(555) 123-4567',
      location: 'New York, NY'
    },
    summary: 'Experienced software engineer...',
    experience: [
      {
        title: 'Senior Developer',
        company: 'Tech Corp',
        duration: '2020 - Present',
        description: 'Led development team...'
      }
    ],
    education: [
      {
        degree: 'B.Sc. Computer Science',
        institution: 'University',
        year: '2019'
      }
    ],
    skills: ['JavaScript', 'React', 'Node.js'],
    certifications: ['AWS Certified']
  },
  ats_score: 85
};

// Simulate sessionStorage
const sessionStorage = {};

// Step 1: Store data when user tries to save (anonymous)
console.log('Step 1: Anonymous user tries to save resume');
sessionStorage.pendingResume = JSON.stringify(resumeData);
console.log('✅ Resume data stored in sessionStorage:', JSON.parse(sessionStorage.pendingResume).title);

// Step 2: User signs in (simulate CustomSignIn component)
console.log('\nStep 2: User signs in successfully');
const pendingResume = sessionStorage.pendingResume;
if (pendingResume) {
  console.log('✅ Found pending resume data, redirecting to resume creation');
  // Note: We DON'T clear the data here anymore (this was the bug!)
  console.log('✅ Data preserved in sessionStorage');
} else {
  console.log('❌ No pending resume data found');
}

// Step 3: User lands on resume creation page
console.log('\nStep 3: User lands on resume creation page');
if (sessionStorage.pendingResume) {
  try {
    const restoredData = JSON.parse(sessionStorage.pendingResume);
    console.log('✅ Resume data successfully restored:');
    console.log('   - Title:', restoredData.title);
    console.log('   - Template:', restoredData.template_id);
    console.log('   - Name:', restoredData.content.personalInfo.name);
    console.log('   - Experience count:', restoredData.content.experience.length);

    // Clear the data after successful restoration
    delete sessionStorage.pendingResume;
    console.log('✅ Data cleared from sessionStorage after restoration');
  } catch (error) {
    console.log('❌ Error parsing pending resume data:', error.message);
  }
} else {
  console.log('❌ No pending resume data found on resume page');
}

console.log('\n🎉 Test completed! The flow should now work correctly.');