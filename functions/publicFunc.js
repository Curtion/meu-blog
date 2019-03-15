class publicFunc {
    /**
     * 检测最大ID
     *
     * @param {*} id
     * @returns
     * @memberof publicFunc
     */
    checkMaxId(id){
        let maxId = id[0]["MAX(id)"];
        if(maxId === null){
            maxId = 0;
        }
        return maxId;
    }
}
module.exports = publicFunc;