const axios = require('axios');

const API_URL = 'http://localhost:5001/api/entry';

async function testAlert() {
    try {
        // Generate random valid vehicle number: TN 99 XX 1234
        const randomDigits = Math.floor(1000 + Math.random() * 9000);
        const vehicleNumber = `TN99XX${randomDigits} `;
        console.log(`1. Entering vehicle ${vehicleNumber}...`);
        const enterRes = await axios.post(`${API_URL}/enter`, { vehicleNumber });
        const entryId = enterRes.data.entryId;
        const assignedSlot = enterRes.data.ticket.slotNumber;
        console.log(`   Parked in ${assignedSlot}. Entry ID: ${entryId}`);

        console.log('2. Exiting vehicle with WRONG SLOT...');
        // Fake a wrong slot (if assigned 'A', report 'B')
        const wrongSlot = assignedSlot.startsWith('A') ? 'B99' : 'A99';
        await axios.put(`${API_URL}/exit/${entryId}`, { actualSlotNumber: wrongSlot });
        console.log(`   Exited claiming slot ${wrongSlot}`);

        console.log('3. Checking Stats...');
        const statsRes = await axios.get(`${API_URL}/stats`);
        console.log('   Stats Response:', JSON.stringify(statsRes.data, null, 2)); // FULL LOG
        const alerts = statsRes.data.recentAlerts;
        console.log('   Recent Alerts:', JSON.stringify(alerts, null, 2));

        const found = alerts.find(a => a.vehicleNumber === vehicleNumber);
        if (found) {
            console.log('SUCCESS: Alert generated!');
        } else {
            console.log('FAILURE: Alert NOT found!');
        }

    } catch (error) {
        if (error.response) {
            console.error('API Error Status:', error.response.status);
            console.error('API Error Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('Network/Script Error:', error.message);
        }
    }
}

testAlert();
