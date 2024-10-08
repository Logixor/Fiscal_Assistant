let arr = [];
function get_us_debt() {
    let results = 30;
    const url = "https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v2/accounting/od/debt_to_penny?sort=-record_date&format=json&page[number]=1&page[size]=" + results;
    fetch(url)
        .then(response => {
            if (!response.ok){
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Convert to dollars
            //const dollars = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data.data[0]['tot_pub_debt_out_amt'].toLocaleString('en-US', { style: 'decimal', maximumFractionDigits: 2 }));
            let dollars = (data.data[0]['tot_pub_debt_out_amt'] * 1.000).toLocaleString('en-US', { style: 'decimal', maximumFractionDigits: 2 });
            // Convert to euros
            let euros = (data.data[0]['tot_pub_debt_out_amt'] * 0.905).toLocaleString('en-US', { style: 'decimal', maximumFractionDigits: 2 });
            dollars = "$ " + dollars;
            euros = "€ " + euros;

            // Write to the HTML elements
            document.getElementById("debt-display-dollars").textContent = dollars;
            document.getElementById("debt-display-euros").textContent = euros;


            const today = new Date();
            const days_arr = [];
            const days = 10;

            // for (let i = 0; i < days; i++) {
            //     const previous_day = new Date(today);
            //     previous_day.setDate(today.getDate() - i);
            //     const formatted_date = `${previous_day.getDate().toString().padStart(2, '0')}/${(previous_day.getMonth() + 1).toString().padStart(2, '0')}/${previous_day.getFullYear()}`;
            //     days_arr.push(formatted_date);
            // };

            for(let i = 0; i < results; i++){
                arr.push(Math.trunc(data.data[i]['tot_pub_debt_out_amt'] * 1.000));
                days_arr.push(data.data[i]['record_date']);
            };

            const current_debt = arr[0];
            const first_debt = arr[arr.length - 1];
            console.log("Current debt: " + current_debt);
            console.log("First debt: " + first_debt);

            const difference = current_debt - first_debt;
            console.log("Difference: " + difference);

            const percentage_change = (difference / current_debt) * 100;
            console.log("Percentage change: " + percentage_change);
            //console.log("Formatted: " + percentage_change.toLocaleString('en-US', { style: 'percent', maximumFractionDigits: 2 }));

            let diff = (difference * 1.000).toLocaleString('en-US', { style: 'decimal', maximumFractionDigits: 2 });

            /////////// Chart ///////////
            const ctx = document.getElementById('chart');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: days_arr.reverse(),
                    datasets: [
                        {
                            label: percentage_change.toFixed(2) + "% ( $ " + diff + " )",
                            data: arr.slice().reverse(),
                            borderWidth: 1
                        }]
                }
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
};

// Call the function to get the US debt data on page load
get_us_debt();
