export default class IeecloudWidgetBodyEditDao {

    dataSource;

    constructor(dataSource) {
        this.dataSource = dataSource;
    }


    readScheme(url, callback) {
        fetch(this.dataSource + url, {
            method: 'GET'
        })
            .then((res) => {
                return res.json();
            })
            .then((result) => {
                callback(result);
            });
    }

    readData(url, callback) {
        fetch(this.dataSource + url, {
            method: 'GET',
        })
            .then((res) => {
                return res.json();
            })
            .then((result) => {
                callback(result);
            });
    }


    async  saveData(url, dataToSave) {
        try {
            const response = await fetch(this.dataSource + url, {
                method: "POST", // or 'PUT'
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataToSave),
            });

            const result = await response.json();
            console.log("Success:", result);
        } catch (error) {
            console.error("Error:", error);
        }
    }
}