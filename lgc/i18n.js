;(function(_) {
	
	var langBox = common.dom.get('langBox')
		 ,langboxEn = common.dom.get('langbox-en')
		 ,langboxRu = common.dom.get('langbox-ru')
		 ,pgContainer = common.dom.get('pg-container')
		 ,pgLoader = common.dom.get('pg-loader')
		 ,body = _.document.body || _.document.getElementsByTagName('body')[0]
		 ,remainingResourses = ['animate.js', 'popupbox.js', 'form.js', 'items.js', 'nav.js', 'menu.js', 'gallery.js'],

	prepareTemplate = function(template, i18n) {
		var bracketsRE = /\{\{\s*i18n\.([\w-$]+?)\s*\}\}/g
			 ,res;
		template = template.replace(bracketsRE, function(match, method) {
			if (method in i18n) {
				return i18n[method];
			}
			else if (console && console.log) {
				return console.log('Unknown directive: \'i18n.' + method + '\'') || match;
			}
		})
		return template;
	},

	load = function() {
		if (common.request.XHRSupport) {
			common.request.get({
				url: '/templates/pg-container-template.txt',
				success: function(template) {
					common.dom.insert('html', 'ab', pgContainer, prepareTemplate(template, i18n));
					_.setTimeout(function() {
						for (var j = 0, resourse; j < remainingResourses.length; ++j) {
							resourse = _.document.createElement('script');
							resourse.type = 'text/javascript';
							resourse.charset = 'UTF-8';
							resourse.src = '/lgc/' + remainingResourses[j];
							body.appendChild(resourse);
						}
						common.dom.addClass(pgContainer, 'show');
					}, 0)
				}
			})
		}
	},

	i18nList = [
				{
					'name': 'Ivan P',
					'undername': 'Frontend Developer',
					'itemName1': 'Intro',
					'itemName2': 'My apps / Works',
					'itemName3': 'About Me',
					'itemName4': 'Contact',
					'introWelcome': 'IVAN SCHNEIDER',
					'introInfo': 'Hi! I\'m Ivan P I\'m a Frontend Developer. Here you can <s>fly</s> find a bit more about me and my work',
					'introAbleTo1': 'View Apps',
					'introAbleTo2': 'Read Info',
					'introAbleTo3': 'Contact Me',
					
					'sectionPortfolioName': 'My apps / Works',
					'sectionPortfolioContent': ' \
							In this section You can view a list of apps I\'ve been developing for a certain period of time. You can view them!',
					
					'sectionAboutName': 'About Me',
					'sectionAboutContent': ' \
						This section intends to answer on some key questions about me and how I \
						\
						can assist you and your project you\'re working on.',

					'sectionAboutHeaderName1': 'Personal Information',
					'sectionAboutHeaderText1': '\
						<p> \
							<b>Name:</b> Ivan \
						</p> \
						<p> \
							<b>Surname:</b> Pankov \
						</p> \
						<p> \
							<b>Age:</b> 22 \
						</p> \
						<p> \
							<b>Internet name:</b> hypotenuse \
						</p> \
						<p> \
							<b>Gender:</b> Male \
						</p> \
						<p> \
							<b>Occupation:</b> Frontend developer \
						</p> \
						<p> \
							<b>Location:</b> Russia \
						</p> \
					',

					'sectionAboutHeaderName2': 'What Do I Know?',
					'sectionAboutHeaderText2': ' \
						<p> \
							<b>Programming languages:</b> JavaScript (JS) \
						</p> \
						<p> \
							<b>Preprocessors:</b> SASS, SCSS \
						</p> \
						<p> \
							<b>Key technologies:</b> Jade(Template Engine), HTML4/HTML5, CSS, JSON/XML \
						</p> \
						<p> \
							<b>Frameworks/Libraries:</b> JQuery, Underscore, AngularJS \
						</p> \
						<p> \
							<b>Backend:</b> PHP, MySQL, Node.js (Superficial knowledge) \
						</p> \
						<p> \
							<b>Familiar with:</b> C/C++, Ruby \
						</p> \
						<p> \
							<b>Languages:</b> English, Russian \
						</p> \
					',

					'sectionAboutHeaderName3': 'What About My Experience?',
					'sectionAboutHeaderText3': 'I\'ve been working as a freelance frontend-programmer since 2014',

					'sectionAboutHeaderName4': 'What About My Education?',
					'sectionAboutHeaderText4': ' \
						<p> \
							<b>MSIU</b> Faculty of Applied Mathematics and Technical Physics (2011 - 2013) \
						</p> \
						<p> \
							<b>Moscow Engineering Physics Institute</b> Faculty of Cybernetics (2013 - 2014) \
						</p> \
					',

					'sectionAboutHeaderName5': 'What Can I Do For You?',
					'sectionAboutHeaderText5': ' \
						<p> \
							<b>If you need programming:</b> \
							I can solve any frontend task primarily using pure JS or its frameworks. \
							Frontend task may be something like: Programming UI Elements, Ajax application, Animations, \
							Integration with other services and so on. \
						</p> \
						<p> \
							<b>If you need markup:</b> \
							I can do it. Whether it is a LP (Landing Page) or multifunctional UI\'s. \
							Have a PSD-Template? I can create a HTML structure based on this template. \
						</p> \
					',

					'sectionAboutHeaderName6': 'What Now?',
					'sectionAboutHeaderText6': ' \
						<p> \
							<b>If you\'re interested</b> You can cooperate with Me (Join me to your applicaiton / project) \
							or maybe ask some additional questions. \
						</p> \
						<p> \
							<b>If not</b> Just click the close button. Simple as that. \
						</p> \
					',

					'sectionContactName': 'Any Questions?',
					'sectionContactContent': ' \
							Here you able to ask me about anything. \
							\
							Just ask. And I\'ll answer you as soon as possible',

					'firstListName': 'Programming',
					'secondListName': 'Markup / Design',

					'usernamePlaceholderText': 'Your name',
					'useremailPlaceholderText': 'Your email',
					'usertextPlaceholderText': 'Your message',
					'submitButtonText': 'Send',

					// Components
					'_popupbox': {
						'emptyName': 'Oops, Your name is empty',
						'emptyEmail': 'Oops, Your email is empty',
						'invalidEmail': 'Oops, Your email is invalid',
						'emptyText': 'Oops, Your message is empty',
						'ok': 'Awesome! Wait for a response'
					},

					'_worksData': [
						// ------ list 1 ------
						[
							{
								name: 'Dpbox'
							 ,title: 'Date picker'
							 ,revisionDate: 'Last revision: 21 March 7048'
							 ,src: '/graphics/imgentities/dpjs.png'
							 ,text: 'Dpbox.JS is a lightweight date picker'
							 ,links: [
							 		{
							 			url: '//github.com/hypotenuse'
							 		 ,text: 'See this app in Github'
							 		}
								]
							}
						 ,{
						 		name: 'Tabber'
						 	 ,title: 'Tabs communication'
						 	 ,revisionDate: 'Last revision: 99 September 2042'
						 	 ,src: '/graphics/imgentities/dpjs.png'
						 	 ,text: 'Tabber.JS is a way to communicate among several opened tabs'
							 ,links: [
									{
										url: '//github.com/hypotenuse'
									 ,text: 'See this app in Github'
									}
								]
						 	}
						 ,{
						 		name: 'Tetris'
						 	 ,title: 'JS Version of Tetris Game'
						 	 ,revisionDate: 'Last revision: 7 May 2071'
						 	 ,src: '/graphics/imgentities/dpjs.png'
							 ,text: 'This is a JS port of a well-known classic game Tetris. \
							 				 Tetris is a Soviet tile-matching puzzle video game originally designed and programmed by Alexey Pajitnov on June 6, 1984.'
							 ,links: [
							 		{
							 			url: '//github.com/hypotenuse'
							 		 ,text: 'See this app in Github'
							 		}
								]
						 	}
						 ,{
						 		name: 'Snake'
						 	 ,title: 'JS Version of Snake Game'
						 	 ,revisionDate: 'Last revision: 21 August 4064'
						 	 ,src: '/graphics/imgentities/dpjs.png'
						 	 ,text: '<p> \
						 	 						You see a JS port of a well-known classic game Snake. \
						 	 						Snake is a general name for video games where the player maneuvers a line which grows in length, with the line itself being a primary obstacle. \
						 	 				 </p> \
						 	 				 <p> \
						 	 				 		By the way, have you ever tried to develop your own version of this game? The game may be quite addictive. \
						 	 				 		I got infected by it and thought that if I want to get rid of the infection I <s>should</s> must to develop my own version. \
						 	 				 		Here we go! What do you see in front of your eyes? Right! My own version of the game. \
						 	 				 </p>'
							 ,links: [
							 		{
							 			url: '//github.com/hypotenuse'
							 		 ,text: 'See this app in Github'
							 		}
								]
							}
						]
						// ------ list 2 ------
					 ,[
					 		{
					 			name: 'Верстка START'
					 		 ,title: 'No title provided'
					 		 ,revisionDate: 'Last revision: 21 March 2014'
					 		 ,src: '/graphics/imgentities/dpjs.png'
					 		 ,text: 'This is awesome description about Верстка START'
							 ,links: [
							 		{
							 			url: '//github.com/hypotenuse'
							 		 ,text: 'See this app in Github'
							 		}
								]
					 		}
					 	 ,{
					 	 		name: 'Верстка 2'
					 	 	 ,title: 'No title provided'
					 	 	 ,revisionDate: 'Last revision: 21 March 2014'
					 	 	 ,src: '/graphics/imgentities/dpjs.png'
					 	 	 ,text: 'This is awesome description about Верстка 2'
							 ,links: [
							 		{
							 			url: '//github.com/hypotenuse'
							 		 ,text: 'See this app in Github'
							 		}
								]
					 	 	}
					 	 ,{
					 	 		name: 'Верстка 3'
							 ,title: 'No title provided'
					 	 	 ,revisionDate: 'Last revision: 21 March 2014'
					 	 	 ,src: '/graphics/imgentities/dpjs.png'
					 	 	 ,text: 'This is awesome description about Верстка 3'
							 ,links: [
							 		{
							 			url: '//github.com/hypotenuse'
							 		 ,text: 'See this app in Github'
							 		}
								]
					 	 	}
					 	 ,{
					 	 		name: 'Верстка 4'
							 ,title: 'No title provided'
					 	 	 ,revisionDate: 'Last revision: 21 March 2014'
					 	 	 ,src: '/graphics/imgentities/dpjs.png'
							 ,text: 'Немного гугла<p><img src="http://img01.deviantart.net/f30e/i/2013/241/9/c/a_new_google_icon_by_jokubas00-d6k75qr.png" width="80%"/></p><p>Вот такой вот гугл, разгуглился</p>'
							 ,links: [
							 		{
							 			url: '//github.com/hypotenuse'
							 		 ,text: 'See this app in Github'
							 		}
								]
					 	 	}
					 	 ,{
					 	 		name: 'Верстка 5'
					 	 	 ,title: 'No title provided'
					 	 	 ,revisionDate: 'Last revision: 21 March 2014'
					 	 	 ,src: '/graphics/imgentities/dpjs.png'
							 ,text: 'This is awesome description about Верстка 5'
							 ,links: [
							 		{
							 			url: '//github.com/hypotenuse'
							 		 ,text: 'See this app in Github'
							 		}
								]
					 	 	}
					 	 ,{
					 	 		name: 'Верстка END'
					 	 	 ,title: 'No title provided'
					 	 	 ,revisionDate: 'Last revision: 21 March 2014'
					 	 	 ,src: '/graphics/imgentities/dpjs.png'
							 ,text: 'This is awesome description about Верстка END'
							 ,links: [
							 		{
							 			url: '//github.com/hypotenuse'
							 		 ,text: 'See this app in Github'
							 		}
								]
					 	 	}
					 	]
					],
					'copy': '2015 © Ivan P'
				},

				{
					'name': 'Ivan P',
					'undername': 'Фронтенд разработчик',
					'itemName1': 'Интро',
					'itemName2': 'Мои приложения',
					'itemName3': 'Обо мне',
					'itemName4': 'Написать мне',
					'introWelcome': 'IVAN SCHNEIDER',
					'introInfo': 'Программирование на JS / Верстка (Создание, поддержка и развитие фронтенд части приложения)',
					'introAbleTo1': 'Мои приложения',
					'introAbleTo2': 'Обо мне',
					'introAbleTo3': 'Написать мне',
					
					'sectionPortfolioName': 'Мои приложения / Работы',
					'sectionPortfolioContent': ' \
							Здесь можно посмотреть список приложений над которыми я работаю или работал.',
					
					'sectionAboutName': 'Обо мне',
					'sectionAboutContent': ' \
							Расширенная информация обо мне и о том чем я могу быть полезен вам и вашему проекту \
							над которым вы работаете. \
							',

					'sectionAboutHeaderName1': 'Персональная информация',
					'sectionAboutHeaderText1': '\
							<p> \
								<b>Имя:</b> Ivan \
							</p> \
							<p> \
								<b>Фамилия:</b> Pankov \
							</p> \
							<p> \
								<b>Возраст:</b> 22 \
							</p> \
							<p> \
								<b>Никнейм:</b> hypotenuse \
							</p> \
							<p> \
								<b>Пол:</b> мужской \
							</p> \
							<p> \
								<b>Род деятельности:</b> Фронтенд разработчик \
							</p> \
							<p> \
								<b>Место нахождения:</b> Россия, Москва \
							</p> \
						',

					'sectionAboutHeaderName2': 'Что знаю и какие технологии использую?',
					'sectionAboutHeaderText2': ' \
						<p> \
							<b>Языки программирования:</b> JavaScript (JS) \
						</p> \
						<p> \
							<b>Препроцессоры:</b> SASS, SCSS \
						</p> \
						<p> \
							<b>Основные технологии:</b> Jade(Template Engine), HTML4/HTML5, CSS, JSON/XML \
						</p> \
						<p> \
							<b>Фреймворки/Библиотеки:</b> JQuery, Underscore, AngularJS \
						</p> \
						<p> \
							<b>Бэкенд:</b> PHP, MySQL, Node.js (Поверхностно) \
						</p> \
						<p> \
							<b>Знаком с:</b> C/C++, Ruby \
						</p> \
						<p> \
							<b>Языки:</b> Английский, Русский \
						</p> \
					',

					'sectionAboutHeaderName3': 'Опыт?',
					'sectionAboutHeaderText3': 'Работаю на биржах фриланса с 2014',

					'sectionAboutHeaderName4': 'Учеба?',
					'sectionAboutHeaderText4': '\
						<p> \
							<b>МГИУ</b> Факультет Прикладной математики и технической физики (2011 - 2013) \
						</p> \
						<p> \
							<b>НИЯУ МИФИ</b> Факультет Кибернетики (2013 - 2014) \
						</p> \
					',

					'sectionAboutHeaderName5': 'Что я могу сделать для вашего проекта?',
					'sectionAboutHeaderText5': ' \
						<p> \
							<b>Если необходимо программирование:</b> \
							Я могу решать любые фронтенд задачи на чистом JS или с помощью его фреймворков/библиотек. \
							Фронтенд задачи, например, могут быть: Программирование пользовательских интерфейсов, \
							Создание асинхронных приложений (Ajax), Анимации, Интеграция со сторонними сервисами и т.д. \
						</p> \
						<p> \
							<b>Если необходима верстка:</b> \
							Я могу верстать от лендингов до многофункциональных пользовательских интерфейсов. \
						</p> \
						',

					'sectionAboutHeaderName6': 'Что дальше?',
					'sectionAboutHeaderText6': ' \
						<p> \
							<b>Если я не безразличен</b>, то Вы можете пригласить меня к себе на проект или задать дополнительные вопросы. \
						</p> \
						<p> \
							<b>Если безразличен</b>, просто закройте данный таб. \
						</p> \
					',

					'sectionContactName': 'Остались вопросы?',
					'sectionContactContent': ' \
						Здесь Вы можете задать их. \
						Просто заполните форму. И я отвечу. \
					',

					'navButtonBoxName1': 'Обо мне',
					'navButtonBoxName2': 'Приложения',
					'navButtonBoxName3': 'Написать',
					'navButtonBoxName4': 'ivvy.me',
					
					'firstListName': 'Программирование',
					'secondListName': 'Верстка / Дизайн',

					'usernamePlaceholderText': 'Ваше имя',
					'useremailPlaceholderText': 'Ваш email',
					'usertextPlaceholderText': 'Ваше сообщение',
					'submitButtonText': 'Отправить',

					// Components
					'_popupbox': {
						'emptyName': 'Вы должны ввести непустое имя',
						'emptyEmail': 'Вы должны ввести непустой email',
						'invalidEmail': 'Неправильный email',
						'emptyText': 'Вы должны ввести непустое сообщение',
						'ok': 'Круто, ждите ответа!'
					},

					'_worksData': [
						// ------ list 1 ------
						[
							{
								name: 'Dpbox',
								title: 'Dpbox JS',
								revisionDate: 'Последнее обновление: 21 Март 2014',
								src: '/graphics/imgentities/dpjs.png',
								text: 'Dpbox - минималистичный Datepicker',
								links: [
							 		{
							 			url: '//github.com/hypotenuse',
							 			text: 'Репозиторий на Github'
							 		}
								]
							},
							{
						 		name: 'Tabber',
								title: 'Tabber JS',
								revisionDate: 'Последнее обновление: 21 Март 2014',
								src: '/graphics/imgentities/dpjs.png',
								text: 'Tabber - предоставляет средства коммуникации между множеством открытых вкладок (табов)',
								links: [
									{
										url: '//github.com/hypotenuse',
										text: 'Репозиторий на Github'
									}
								]
						 	},
						 	{
						 		name: 'Tetris Game',
						 		title: 'JS версия популярной игры Tetris',
						 		revisionDate: 'Последнее обновление: 21 Март 2014',
						 		src: '/graphics/imgentities/dpjs.png',
						 		text: 'Это JS версия известной игры Tetris. \
						 					 Тетрис известен своим свойством заразительности, \
						 					 ненавязчивой графикой и динамичностью. \
						 					 Оригинальный тетрис был разработан Алексеем Пажитновым в недалеком 1984 году.',
						 		links: [
							 		{
							 			url: '//github.com/hypotenuse',
							 			text: 'Репозиторий на Github'
							 		}
								]
						 	},
						 	{
						 		name: 'Snake Game',
						 		title: 'JS версия популярной игры Snake',
						 		revisionDate: 'Последнее обновление: 21 Март 2014',
						 		src: '/graphics/imgentities/dpjs.png',
						 		text: 'Это JS версия известной игры Snake. \
						 					 Механика игры проста и тривиальна - игрок маневрирует некой линией, которая растет в длинну \
						 					 и которая может сгибаться. По мере маневрирования игрок заботится о том, чтобы линия была \
						 					 как можно больше для того, чтобы набрать очки, при этом понимая, что чем больше линия, тем больше \
						 					 шансов проиграть. Главное - не врезаться в игровое поле и не съесть себя по мере того, как игрок \
						 					 набирает очки.',
						 		links: [
							 		{
							 			url: '//github.com/hypotenuse',
							 			text: 'Репозиторий на Github'
							 		}
								]
							}
						],
						// ------ list 2 ------
						[
					 		{
					 			name: 'Сверстай и выложи 1',
					 			title: 'Нет названия',
					 			revisionDate: 'Последнее обновление: 21 Март 2014',
					 			src: '/graphics/imgentities/dpjs.png',
					 			text: 'Определенно офигенное описание 1',
					 			links: [
							 		{
							 			url: '//github.com/hypotenuse',
							 			text: 'Репозиторий на Github'
							 		}
								]
					 		},
					 		{
					 	 		name: 'Сверстай и выложи 2',
					 	 		title: 'Нет названия',
					 	 		revisionDate: 'Последнее обновление: 21 Март 2014',
					 	 		src: '/graphics/imgentities/dpjs.png',
					 	 		text: 'Определенно офигенное описание 2',
					 	 		links: [
							 		{
							 			url: '//github.com/hypotenuse',
							 			text: 'Репозиторий на Github'
							 		}
								]
					 	 	},
					 	 	{
					 	 		name: 'Сверстай и выложи 3',
					 	 		title: 'Нет названия',
					 	 		revisionDate: 'Последнее обновление: 21 Март 2014',
					 	 		src: '/graphics/imgentities/dpjs.png',
					 	 		text: 'Определенно офигенное описание 3',
					 	 		links: [
							 		{
							 			url: '//github.com/hypotenuse',
							 			text: 'Репозиторий на Github'
							 		}
								]
					 	 	},
					 	 	{
					 	 		name: 'Сверстай и выложи 4',
					 	 		title: 'Нет названия',
					 	 		revisionDate: 'Последнее обновление: 21 Март 2014',
					 	 		src: '/graphics/imgentities/dpjs.png',
					 	 		text: 'Определенно офигенное описание 4',
					 	 		links: [
							 		{
							 			url: '//github.com/hypotenuse',
							 			text: 'Репозиторий на Github'
							 		}
								]
					 	 	},
					 	 	{
								name: 'Сверстай и выложи 5',
								title: 'Нет названия',
								revisionDate: 'Последнее обновление: 21 Март 2014',
								src: '/graphics/imgentities/dpjs.png',
								text: 'Определенно офигенное описание 5',
								links: [
									{
										url: '//github.com/hypotenuse',
							 			text: 'Репозиторий на Github'
									}
								]
							}
						]
					],
					'copy': '© 2015. Разработано Ivan P'
				}
	]

	if (common.cookie.get('i18n') == null) {
		langboxEn.onclick = langboxRu.onclick = function(Event) {
			var type = common.event.getTarget(Event).id;
			if (type == 'langbox-en') {
				_.i18n = i18nList[0];
				common.cookie.set('i18n', 'en');
			}
			else {
				_.i18n = i18nList[1];
				common.cookie.set('i18n', 'ru');
			}
			common.dom.removeClass(langBox, 'show');
			load();
		}
	}
	else {
		if (common.cookie.get('i18n') == 'en') {
			_.i18n = i18nList[0];
		}
		else {
			_.i18n = i18nList[1];
		}
		load();
	}

})(window);
