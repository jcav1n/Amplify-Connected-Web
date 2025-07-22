// This part is used for the import of the necessary AWS Amplify tools needed to be implemeneted in the code

import {Amplify, API, graphqlOperation} from 'https://unpkg.com/aws-amplify@5.0.4/dist/aws-amplify.esm.js';
import awsExports from './aws-exports.js';
import {createSymptomLog} from './graphql/mutations.js';

Amplify.configure(awsExports);


// Java Script file that will contain the necessary code to help secure the file
document.addEventListener("DOMContentLoaded", function() {
	const form = document.getElementById("symptomForm");
	const resultsDiv = document.getElementById("resultsDiv");
	const thankYou = document.getElementById("thankyou");
});


// I want to use JSON and the given framework so I am currently looking into it

if (form) {
	form.addEventListener('submit', async function(e) {
		e.preventDefault();

		const formData = {
			patient_name: document.getElementById('patient_name').value.trim(), 
			patient_age: parseInt(document.getElementById('patient_age')).value,
			patient_sex: document.getElementById('patient_sex').value,
			patient_weight: document.getElementById('patient_weight').value.trim(),
			submittedAt: new Date().toISOString()
		};

		const checkboxes = form.querySelectorAll('input[type="checkbox"]');
		checkboxes.forEach(checkbox=> {
			formData[checkbox.id] = checkbox.checked;
		});

		try {
			const response = await fetch('/symptoms', {
				method: 'POST', 
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formData)
			});

			const result = await response.json();
			currentLogID = result.log_id;

			const resultsDiv = document.getElementById('resultsDiv');

			resultsDiv.classList.remove('high', 'moderate', 'low', 'lowest');
			resultsDiv.classList.add(result.likelihood.toLowerCase());

			let resultsHTML = `
                    <h3>UTI Likelihood: ${result.likelihood}</h3>
                    <p>${result.explanation}</p>
                    <button class="btn btn-primary mt-3" onclick="showDetailsModal(${result.log_id})">
                       Add Test Results
                    </button>
            `;

            if (result.mlprediction !== undefined) {
            	resultsHTML += `
            	<div class="ml-prediction">
            		<h4>Machine Learning Analysis</h4>
            		<p>${result.ml_explanation}</p>
            	</div>
            	`;
            }

            resultsDiv.innerHTML = resultsHTML;
            resultsDiv.style.display = 'block';
            resultsDiv.scrollIntoView({behavior: 'smooth' });
		} catch (error) {
			console.error('Error:' error);
			alert('There was an error submitting your symptoms. Please try again. ');
		}
		
});
}

// Function section to delete patient data from the website 
function deletion(logID, patient) {
	document.getElementById('deletePatientName').textContent = patient;
	const modal = new bootstrap.Modal(document.getElementById('deleteConfirmModal'));

	// Button handling for the deletion function 
	document.getElementById('confirmDeleteBtn').onclick = async function() {
		try {
			const response = await fetch(`/delete-symptom-log/${logID}`, {
				method: 'DELETE'
			});

			if (response.ok){
				location.reload();
			} else{
				throw new Error('Failed to delete record');
			}
		} catch (error) {
			console.error('Error:', error);
			alert('Error deleting record');
		}
	};

	modal.show();
}

const sections = document.querySelectorAll('.symptom-section');
sections.forEach(section=> {
	const heading = section.querySelector('h2');
	const content = section.querySelector('.symptom-list');

	if (heading && content) {
		heading.addEventListener('click', () => {
			content.style.display = content.style.display === 'none' ? 'block' : 'none';

		});
	}
});

