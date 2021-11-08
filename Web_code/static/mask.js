const form = document.querySelector('#searchForm');
form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const res = await fetch('https://api.thingspeak.com/channels/1346888/feeds.json?api_key=OHOZT1ZZGX1WLJTR&results=2')
    let data = await res.json();
    //console.log(data);
    //console.log(data.feeds[0].field1)

    console.log(data)

    const arr = [];
    arr.push(data)
    //console.log(arr);
    console.log(arr[0].feeds[0].field1)
    console.log(arr[0].feeds[0].field2)

    console.log(data.channel.id)

    let tab = 
    `<tr id="head">
        <th>ID</th>
        <th>Date/Time</th>
        <th>Temperature</th>
        <th>Humidity</th>
    </tr>`;
    
    // Loop to access all rows 
    for (let r of arr[0].feeds) {
        tab += `<tr> 
    <td>${data.channel.id} </td>
    <td>${r.created_at}</td>
    <td>${r.field1}</td> 
    <td>${r.field2}</td>          
    </tr>`;
    }

    document.getElementById("menu").innerHTML = tab;
})