export default class IeecloudTreeDao {

    dataSource;

    constructor(dataSource) {
        this.dataSource = dataSource;
    }


    readScheme(url, callback) {
      return   fetch(this.dataSource + url, {
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
      return   fetch(this.dataSource + url, {
            method: 'GET',
        })
            // .then((res) => {
            //     return res.json();
            // })
            // .then((result) => {
            //     callback(result);
            // });
    }
}