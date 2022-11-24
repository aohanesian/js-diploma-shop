(async () => {
        const API = `https://634e9f834af5fdff3a625f84.mockapi.io`;
        const controller = async (url, method = `GET`, obj) => {
            let options = {
                method: method,
                headers: {
                    "Content-type": "application/json"
                }
            }
            if (obj) options.body = JSON.stringify(obj);
            let request = await fetch(url, options),
                response = request.ok ? request.json() : Promise.reject();
            return response;
        };
        const count = document.querySelector(`#headerShoppingCartCount`);
        const headerShoppingCart = document.querySelector(`#headerShoppingCart`)
        const headerHandle = () => {
            const headerUser = document.querySelector(`#headerUser`)
            headerShoppingCart.href = `shoppingCart.html`
            const headerLogout = document.querySelector(`#headerLogout`);
            let user = JSON.parse(localStorage.getItem(`UserLogIn`))
            count.innerHTML = user.shoppingCart.length.toString();
            headerUser.innerHTML = user.name;
            headerUser.href = `account.html`
            headerLogout.classList.add(`active`);
            headerLogout.addEventListener(`click`, async (e) => {
                e.stopPropagation();
                user = JSON.parse(localStorage.getItem(`UserLogIn`))
                user.status = false
                let userLogout = await controller(API + `/users/` + user.id, `PUT`, user);
                localStorage.clear();
                window.location.replace(`index.html`);
            })
        }
        (JSON.parse(localStorage.getItem(`status`))) ? headerHandle() : headerShoppingCart.href = `login.html`;

//login start
        if (window.location.href.includes(`login.html`)) {
            // validations start
            let errMsg = ``;

            function userNameValidation(userName, err) {
                let letters = /^[A-Za-z]+$/;
                if (userName.value.match(letters)) {
                    return true;
                } else {
                    err.classList.add(`active`);
                    err.innerHTML = `Invalid name`;
                    console.log(`invalid name`);
                    userName.focus();
                    errMsg += `name Error \n`
                    return false;
                }
            }

            function emailValidation(email, err) {
                let mailformat = /^[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,4}$/;
                if (email.value.match(mailformat)) {
                    return true;
                } else {
                    err.classList.add(`active`);
                    err.innerHTML = `Invalid email`;
                    email.focus();
                    console.log(`Email error`)
                    errMsg += `Email Error \n`
                    return false;
                }
            }

            function passwdValidation(pass, err) {
                if (pass.value) return true;
                else {
                    err.classList.add(`active`);
                    err.innerHTML = `Invalid password`;
                    pass.focus();
                    console.log(`Password error`)
                    errMsg += `\n Password Error`
                    return false;
                }
            }

            function passwdMatchValidate(pass, passConfirm, err) {
                if (pass.value === passConfirm.value) {
                    return true;
                } else {
                    err.classList.add(`active`);
                    err.innerHTML = `Passwords do not match`;
                    pass.focus();
                    console.log(`Passwords do not match`)
                    errMsg += `\n Passwords do not match`
                    return false;
                }
            }

            //validations end

            //sign in start
            const signInErr = document.querySelector(`#loginForm .error`);
            const signInEmail = document.querySelector(`#signInEmail`);
            const signInPasswd = document.querySelector(`#signInPasswd`);
            const signInBtn = document.querySelector(`#signInBtn`);
            signInBtn.addEventListener(`click`, async (e) => {
                e.preventDefault();
                e.stopPropagation();

                if (emailValidation(signInEmail, signInErr) && passwdValidation(signInPasswd, signInErr)) {
                    let userLogInCredentials = {
                        email: signInEmail.value.toLowerCase().trim(),
                        password: signInPasswd.value,
                    }

                    let allUsers = await controller(API + `/users`);
                    let userExists = allUsers.filter(item => item.email === userLogInCredentials.email && item.password === userLogInCredentials.password);
                    if (userExists.length) {
                        let UserLogIn = await controller(API + `/users/` + userExists[0].id);
                        UserLogIn.status = true;
                        await controller(API + `/users/` + userExists[0].id, `PUT`, UserLogIn);
                        localStorage.setItem(`UserLogIn`, JSON.stringify(UserLogIn))
                        localStorage.setItem(`orders`, JSON.stringify(UserLogIn.orders))
                        localStorage.setItem(`shoppingCart`, JSON.stringify(UserLogIn.shoppingCart))
                        localStorage.setItem(`id`, JSON.stringify(UserLogIn.id))
                        localStorage.setItem(`name`, JSON.stringify(UserLogIn.name))
                        localStorage.setItem(`email`, JSON.stringify(UserLogIn.email))
                        localStorage.setItem(`status`, JSON.stringify(UserLogIn.status))
                        window.location.replace("index.html")
                        return true;
                    } else {
                        signInErr.classList.add(`active`)
                        signInErr.innerHTML = `Wrong Email or Password`;
                        return false;
                    }
                }
            })
            //sign in emd

            //create acc start
            const regErr = document.querySelector(`#registrationForm .error`);
            const userName = document.querySelector(`#userName`);
            const regEmail = document.querySelector(`#regEmail`);
            const regPasswd = document.querySelector(`#regPasswd`);
            const regPasswdConfirm = document.querySelector(`#regPasswdConfirm`);
            const regBtn = document.querySelector(`#regBtn`);
            regBtn.addEventListener(`click`, async (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (userNameValidation(userName, regErr) &&
                    emailValidation(regEmail, regErr) &&
                    passwdValidation(regPasswd, regErr) &&
                    passwdMatchValidate(regPasswd, regPasswdConfirm, regErr)) {
                    let userRegCredentials = {
                        name: userName.value.trim(),
                        email: regEmail.value.toLowerCase().trim(),
                        password: regPasswd.value,
                        status: true,
                    }

                    let allUsers = await controller(API + `/users`);
                    let userExists = allUsers.filter(item => item.email === userRegCredentials.email);
                    if (userExists.length) {
                        regErr.classList.add(`active`)
                        regErr.innerHTML = `User with "${userRegCredentials.email}" email already exists`;
                        return false;
                    } else {
                        let userReg = await controller(API + `/users`, `POST`, userRegCredentials);
                        localStorage.setItem(`UserLogIn`, JSON.stringify(userReg))
                        localStorage.setItem(`orders`, JSON.stringify(userReg.orders))
                        localStorage.setItem(`shoppingCart`, JSON.stringify(userReg.shoppingCart))
                        localStorage.setItem(`id`, JSON.stringify(userReg.id))
                        localStorage.setItem(`name`, JSON.stringify(userReg.name))
                        localStorage.setItem(`email`, JSON.stringify(userReg.email))
                        localStorage.setItem(`status`, JSON.stringify(userReg.status))
                        window.location.replace("index.html")
                        return true;
                    }
                }
            });
            //create acc end
        }
//login end

//index start
        if (window.location.href.includes(`index.html`)) {
            let allOrders = JSON.parse(localStorage.getItem(`status`)) ? JSON.parse(localStorage.getItem(`UserLogIn`)).shoppingCart : [];
            const categoriesContainer = document.querySelector(`.category__container`);
            const renderProducts = async () => {
                try {
                    let products = await controller(API + `/products`)
                        .then(products => products.map(product => {
                            // renderSections(product);
                            renderProductTile(product);
                        }))
                } catch (err) {
                    console.log(err)
                }
            }

            const renderSections = (product) => {
                const section = document.createElement(`section`);
                section.className = `category`;
                section.setAttribute(`data-name`, product.category)
                const productCatHeader = document.createElement(`h2`);
                productCatHeader.innerHTML = product.category;
                productCatHeader.append(section)
                categoriesContainer.append(section)
            }

            const renderProductTile = (product) => {
                const tile = document.createElement(`div`);
                tile.classList.add(`product`);
                tile.setAttribute(`data-id`, product.id)

                const img = document.createElement(`img`);
                img.setAttribute(`src`, `./images/products/${product.img}.png`)
                img.classList.add("product__img");
                img.alt = product.title;
                img.height = 80;

                const productTitle = document.createElement(`p`);
                productTitle.classList.add(`product__title`)
                productTitle.innerHTML = product.title
                let tilePrice = product.price

                const productSale = document.createElement(`div`);
                if (product.sale) {
                    const saleOld = document.createElement(`span`);
                    saleOld.className = `product__sale--old`
                    saleOld.innerHTML = `$${product.price}`
                    const salePercent = document.createElement(`span`);
                    salePercent.className = `product__sale--percent`;
                    salePercent.innerHTML = `-${product.salePercent}%`
                    tilePrice = product.price - ((product.salePercent * product.price) / 100)
                    productSale.append(saleOld, salePercent)
                }

                const productInfo = document.createElement(`div`);
                productInfo.classList.add(`product__info`);

                const productPrice = document.createElement(`span`);
                productPrice.classList.add(`product__price`);
                productPrice.innerHTML = `$${tilePrice}`;

                const productCartBtn = document.createElement(`button`);
                productCartBtn.classList.add(`product__cart`);
                allOrders.find((element, index) => element.id === product.id) && productCartBtn.classList.add(`product__cart--in`);
                productCartBtn.addEventListener(`click`, async (e) => {
                    if (!JSON.parse(localStorage.getItem(`status`))) {
                        document.location.href = `login.html`;
                    } else {
                        productCartBtn.disabled = true;
                        let shoppingCart = JSON.parse(localStorage.getItem(`UserLogIn`)).shoppingCart
                        const headerShoppingCartCount = document.querySelector(`#headerShoppingCartCount`)
                        if (productCartBtn.classList.contains(`product__cart--in`)) {
                            let newShoppingCart = shoppingCart.filter(item => item.id !== product.id);
                            allOrders = newShoppingCart
                            localStorage.setItem(`shoppingCart`, JSON.stringify(newShoppingCart));
                            let UserLogIn = JSON.parse(localStorage.getItem(`UserLogIn`))
                            UserLogIn.shoppingCart = newShoppingCart;
                            localStorage.setItem(`UserLogIn`, JSON.stringify(UserLogIn))
                            await controller(API + `/users/` + JSON.parse(localStorage.getItem(`id`)), `PUT`, UserLogIn)
                            productCartBtn.classList.remove(`product__cart--in`);
                            headerShoppingCartCount.innerHTML = JSON.parse(localStorage.getItem(`UserLogIn`)).shoppingCart.length.toString()
                        } else {
                            let shoppingCart = JSON.parse(localStorage.getItem(`shoppingCart`));
                            shoppingCart.push({id: product.id, count: 1});
                            localStorage.setItem(`shoppingCart`, JSON.stringify(shoppingCart));
                            let UserLogIn = JSON.parse(localStorage.getItem(`UserLogIn`))
                            UserLogIn.shoppingCart = shoppingCart;
                            localStorage.setItem(`UserLogIn`, JSON.stringify(UserLogIn))
                            await controller(API + `/users/` + JSON.parse(localStorage.getItem(`id`)), `PUT`, UserLogIn)
                            productCartBtn.classList.add(`product__cart--in`)
                            headerShoppingCartCount.innerHTML = JSON.parse(localStorage.getItem(`UserLogIn`)).shoppingCart.length.toString()
                        }
                    }
                    productCartBtn.disabled = false;
                })

                const shoppingCartImg = document.createElement(`img`);
                shoppingCartImg.src = "images/shopping-cart.png";
                shoppingCartImg.alt = "shopping cart";
                shoppingCartImg.height = 20;

                productInfo.append(productPrice, productCartBtn)
                productCartBtn.append(shoppingCartImg)
                tile.append(img, productTitle, productSale, productInfo)
                categoriesContainer.append(tile)
            }

            renderProducts();
        }
//index end

//account start
        if (window.location.href.includes(`account.html`)) {
            const deleteAcc = document.querySelector(`#deleteAcc`)
            const userInfoName = document.querySelector(`#userInfoName`)
            const userInfoEmail = document.querySelector(`#userInfoEmail`)
            const getUserInfo = async () => {
                try {
                    let user = await controller(API + `/users/` + JSON.parse(localStorage.getItem(`UserLogIn`)).id)
                        .then(user => {
                            userInfoName.innerHTML = user.name;
                            userInfoEmail.innerHTML = user.email
                            return user;
                        }).then(user => user.orders.forEach(order => renderProductTable(order)));
                } catch (err) {
                    console.log(err)
                }
            }
            deleteAcc.addEventListener(`click`, async () => {
                let deletedUser = await controller(API + `/users/` + Number(JSON.parse(localStorage.getItem(`UserLogIn`)).id), `DELETE`);
                localStorage.clear();
                window.location.replace("index.html")
            })

            async function renderProductTable(data) {
                console.log(data.count);
                let allProducts = await controller(API + `/products`)
                let currentItem = allProducts.filter(product => product.id === data.id)
                let tilePrice = currentItem[0].price;
                console.log(tilePrice);
                if (currentItem[0].sale) {
                    tilePrice = currentItem[0].price - ((currentItem[0].salePercent * currentItem[0].price) / 100)
                }
                console.log(tilePrice);
                const tbody = document.querySelector(`#orderTable tbody`)
                let tr = document.createElement(`tr`);
                let tdDescription = document.createElement(`td`);
                tdDescription.innerHTML = `<div class="item__info">
                    <img src="images/products/${currentItem[0].img}.png" alt="${currentItem[0].title}" height="100">
                        <div>
                            <p class="item__info--title">${currentItem[0].title}</p>
                        </div>
                    </div>`;
                let tdPrice = document.createElement(`td`);
                tdPrice.innerHTML = `$${currentItem[0].price}`
                let tdSale = document.createElement(`td`);
                if (currentItem[0].sale) {
                    tdSale.innerHTML = `<span class="item__sale">- ${currentItem[0].salePercent}%</span>`
                } else tdSale.innerHTML = `-`

                let TdQuantity = document.createElement(`td`);
                TdQuantity.innerHTML = data.count
                let tdTotal = document.createElement(`td`);
                tdTotal.innerHTML = `${tilePrice * data.count}`;
                tr.append(tdDescription, tdPrice, tdSale, TdQuantity, tdTotal);
                tbody.append(tr);
            }

            getUserInfo()
        }
//account end

//cart start
        if (window.location.href.includes(`shoppingCart.html`)) {
            let allProducts = await controller(API + `/products`)
            let completeOrder = document.querySelector(`#completeOrder`)
            if (JSON.parse(localStorage.getItem(`shoppingCart`)).length) {
                completeOrder.disabled = false
            } else {
                completeOrder.style.cursor = `not-allowed`;
                completeOrder.disabled = true
            }
            const OrderTotalArr = []
            const renderCart = async () => {
                try {
                    let user = await controller(API + `/users/` + JSON.parse(localStorage.getItem(`UserLogIn`)).id)
                        .then(user => user.shoppingCart.forEach(data => renderProductCart(data)))
                } catch (err) {
                    console.log(err)
                }
            }

            async function calcOrderTotal(price, count) {
                OrderTotalArr.push(price * count)
                return OrderTotalArr.reduce((a, b) => a + b)
            }

            async function renderProductCart(data) {
                let totalPrice = document.querySelector(`#orderSummaryTotal`);
                let currentItem = allProducts.filter(product => product.id === data.id)
                let tilePrice = currentItem[0].price;
                if (currentItem[0].sale) {
                    tilePrice = currentItem[0].price - ((currentItem[0].salePercent * currentItem[0].price) / 100)
                }
                totalPrice.innerHTML = `$${await calcOrderTotal(tilePrice, data.count)}`
                const tbody = document.querySelector(`#shoppingCartTable tbody`)
                let tr = document.createElement(`tr`);
                let tdDescription = document.createElement(`td`);
                tdDescription.innerHTML = `<div class="item__info">
                    <img src="images/products/${currentItem[0].img}.png" alt="${currentItem[0].title}" height="100">
                    <div>
                      <p class="item__info--title">${currentItem[0].title}</p>
                    </div>
                  </div>`
                let tdPrice = document.createElement(`td`);
                tdPrice.innerHTML = `$${currentItem[0].price}`
                let tdSale = document.createElement(`td`);
                currentItem[0].sale ? tdSale.innerHTML = `<span class="item__sale">- ${currentItem[0].salePercent}%</span>` : tdSale.innerHTML = `-`
                let TdQuantity = document.createElement(`td`);
                let inputQuantity = document.createElement("input");
                inputQuantity.type = `number`
                inputQuantity.value = `${data.count}`;
                inputQuantity.setAttribute(`min`, `1`);
                TdQuantity.append(inputQuantity);
                let tdTotal = document.createElement(`td`);
                tdTotal.innerHTML = `$${tilePrice * data.count}`;
                let previousValue = data.count;
                inputQuantity.addEventListener(`change`, async e => {
                    e.stopPropagation()
                    let user = JSON.parse(localStorage.getItem(`UserLogIn`))
                    if (inputQuantity.value > previousValue) {
                        tdTotal.innerHTML = `$${tilePrice * inputQuantity.value}`
                        totalPrice.innerHTML = `$${Number(totalPrice.innerHTML.slice(1)) + Number(tilePrice)}`
                        user.shoppingCart.filter(item => item.id === data.id)[0].count = inputQuantity.value
                        previousValue = inputQuantity.value;
                    } else {
                        tdTotal.innerHTML = `$${tilePrice * inputQuantity.value}`
                        totalPrice.innerHTML = `$${Number(totalPrice.innerHTML.slice(1)) - Number(tilePrice)}`
                        user.shoppingCart.filter(item => item.id === data.id)[0].count = inputQuantity.value
                        previousValue = inputQuantity.value;
                    }
                    localStorage.setItem(`UserLogIn`, JSON.stringify(user))
                    await controller(API + `/users/` + user.id, `PUT`, user)
                })

                let tdAction = document.createElement(`td`);
                let tdActionBtn = document.createElement(`button`);
                tdActionBtn.classList.add("item__remove");
                tdActionBtn.innerHTML = `<img src="./images/delete.png" alt="delete" height="20">`
                tdAction.append(tdActionBtn)
                tdActionBtn.addEventListener(`click`, async (e) => {
                    e.stopPropagation();
                    let user = JSON.parse(localStorage.getItem(`UserLogIn`))
                    let sc = JSON.parse(localStorage.getItem(`shoppingCart`)).filter(item => item.id !== data.id);
                    let sc2 = JSON.parse(localStorage.getItem(`UserLogIn`)).shoppingCart.filter(item => item.id !== data.id);
                    user.shoppingCart = sc2
                    localStorage.setItem(`UserLogIn`, JSON.stringify(user))
                    localStorage.setItem(`shoppingCart`, JSON.stringify(sc))
                    totalPrice.innerHTML = `$${Number(totalPrice.innerHTML.slice(1)) - Number(tdTotal.innerHTML.slice(1))}`
                    await controller(API + `/users/` + user.id, `PUT`, user)
                    if (!sc.length) {
                        completeOrder.disabled = true
                        completeOrder.style.cursor = `not-allowed`;
                    }
                    tr.remove()
                })
                tr.append(tdDescription, tdPrice, tdSale, TdQuantity, tdTotal, tdAction);
                tbody.append(tr);
            }

            completeOrder.addEventListener(`click`, async (e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    let user = JSON.parse(localStorage.getItem(`UserLogIn`))
                    user.orders = user.orders.concat(user.shoppingCart);
                    user.shoppingCart = [];
                    localStorage.setItem(`UserLogIn`, JSON.stringify(user));
                    console.log(user);
                    localStorage.setItem(`shoppingCart`, JSON.stringify(user.shoppingCart));
                    await controller(API + `/users/` + user.id, `PUT`, user);
                    document.location.href = `account.html`;
                }
            )

            renderCart()
        }
//cart emd
    }
)
()
