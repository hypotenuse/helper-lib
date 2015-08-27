;(function(_) {
	
	var langBox = common.dom.get('langBox')
		 ,langboxEn = common.dom.get('langbox-en')
		 ,langboxRu = common.dom.get('langbox-ru')
		 ,pgContainer = common.dom.get('pg-container')
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
					'undername': 'Frontend developer',
					'itemName1': 'Intro',
					'itemName2': 'My apps / Works',
					'itemName3': 'About Me',
					'itemName4': 'Contact',
					'introWelcome': 'hypotenuse',
					'introAbleTo1': 'View Apps',
					'introAbleTo2': 'Read Info',
					'introAbleTo3': 'Send Me',
					
					'sectionPortfolioName': 'My apps / Works',
					'sectionPortfolioContent': ' \
							In this section You can view a list of apps I\'ve been developing for a certain period of time. You can view them!',
					
					'sectionAboutName': 'About Me',
					'sectionAboutContent': ' \
							Here I decided to make a Question & Answer section. \
							\
							The section intends to answer on some key questions about me and how I \
							\
							can assist you and your project you\'re working on.',

					'sectionAboutHeaderName1': 'Personal information',
					'sectionAboutHeaderText1': '\
						Name:&nbsp;<b>Ivan</b> \
							\
							Surname:&nbsp;<b>Pankov</b> \
							\
							Internet name: <b>hypotenuse</b> \
							\
							Age:&nbsp;<b>22</b> \
							\
							Gender:&nbsp;<b>Male</b> \
							\
							Occupation:&nbsp;<b>Frontend developer</b> \
							\
							Location:&nbsp;<b>Russia, Moscow</b> \
						',

					'sectionAboutHeaderName2': 'What do I know?',
					'sectionAboutHeaderText2': ' \
							Programming languages: <b>JS</b> \
							\
							Preprocessors: <b>SASS, SCSS</b> \
							\
							Frameworks/Libraries: <b>AngularJS, JQuery, Underscore / Lo-Dash. \
							\
							Also, It\'s not too difficult to learn & use anything else \
							\
							(library or framework). It depends on what you want to achieve.</b> \
							\
							Other technologies: <b>CSS, HTML, JSON/XML</b> \
							\
							Backend: <b>PHP, Node.js. (Superficial knowledge)</b>',

					'sectionAboutHeaderName3': 'What about my experience?',
					'sectionAboutHeaderText3': 'I\'ve been working as a freelance frontend-programmer since 2014',

					'sectionAboutHeaderName4': 'What about my education?',
					'sectionAboutHeaderText4': ' \
							MSIU. Faculty of Applied Mathematics and Technical Physics (2011 - 2013). \
							\
							Moscow Engineering Physics Institute. Faculty of Cybernetics (2013 - 2014).',

					'sectionAboutHeaderName5': 'What can I do for you?',
					'sectionAboutHeaderText5': ' \
							If you need programming: \
							\
							I can solve any frontend task primarily using pure JS or its frameworks. \
							\
							If you need a makeup: \
							\
							I can do a makeup. Whether it is a LP (Landing Page) or multifunctional UI\'s. \
					',

					'sectionAboutHeaderName6': 'What should you do now?',
					'sectionAboutHeaderText6': ' \
							If you\'re interested in the information above You can ask me a question \
							\
							If not it\'s OK. Probably you\'re looking for something different or something that fits your needs.',

					'sectionContactName': 'Any Questions?',
					'sectionContactContent': ' \
							Here you able to ask me about anything. \
							\
							Just ask. And I\'ll answer you as soon as possible',

					'navButtonBoxName1': 'About Me',
					'navButtonBoxName2': 'My apps',
					'navButtonBoxName3': 'Contact',
					'navButtonBoxName4': 'Intro',

					'firstListName': 'Programming',
					'secondListName': 'Makeup / Design',

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
							 ,revisionDate: 'Last revision: 21 March 2014'
							 ,src: '/graphics/imgentities/dpjs.png'
							 ,text: 'A lightweight date picker'
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
						 	 ,revisionDate: 'Last revision: 21 March 2014'
						 	 ,src: '/graphics/imgentities/dpjs.png'
						 	 ,text: 'tabber.js is a way to communicate among several opened tabs'
							 ,links: [
									{
										url: '//github.com/hypotenuse'
									 ,text: 'See this app in Github'
									}
								]
						 	}
						 ,{
						 		name: 'Tetris Game'
						 	 ,title: 'JS Version of Tetris'
						 	 ,revisionDate: 'Last revision: 21 March 2014'
						 	 ,src: '/graphics/imgentities/dpjs.png'
							 ,text: 'JS port of a well known classic game Tetris. <br>Tetris is a Soviet tile-matching puzzle video game originally designed and programmed by Alexey Pajitnov on June 6, 1984.'
							 ,links: [
							 		{
							 			url: '//github.com/hypotenuse'
							 		 ,text: 'See this app in Github'
							 		}
								]
						 	}
						 ,{
						 		name: 'Snake Game'
						 	 ,title: 'JS Version of Snake'
						 	 ,revisionDate: 'Last revision: 21 March 2014'
						 	 ,src: '/graphics/imgentities/dpjs.png'
						 	 ,text: 'JS port of a well known classic game Snake. <br>Snake is a general name for video games where the player maneuvers a line which grows in length, with the line itself being a primary obstacle.'
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
					 			name: 'Верстка 1'
					 		 ,title: 'No title provided'
					 		 ,revisionDate: 'Last revision: 21 March 2014'
					 		 ,src: '/graphics/imgentities/dpjs.png'
					 		 ,text: 'This is awesome description about Верстка 1'
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
							 ,text: 'This is awesome description about Верстка 4'
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
					 	]
					],
					'copy': '© 2015. Developed by Ivan P'
				},

				{
					'name': 'Ivan Пэ',
					'undername': 'Фронтенд разработчик',
					'itemName1': 'Интро',
					'itemName2': 'Мои приложения',
					'itemName3': 'Обо мне',
					'itemName4': 'Написать мне',
					'introWelcome': 'hypotenuse',
					'introAbleTo1': 'Посмотреть работы',
					'introAbleTo2': 'Посмотреть информацию',
					'introAbleTo3': 'Отправить сообщение',
					
					'sectionPortfolioName': 'Мои приложения / Работы',
					'sectionPortfolioContent': ' \
							Здесь собран список приложений над которыми я работал (работаю). \
							\
							Вы можете посмотреть более подробную информацию об определенном приложении.',
					
					'sectionAboutName': 'Обо мне',
					'sectionAboutContent': ' \
							Здесь собранны ответы на некоторые ключевые вопросы. \
							\
							Я постарался выложить здесь наиболее важную информацию. \
							\
							Возможно, если информации не достаточно, Вы можете мне написать.',

					'sectionAboutHeaderName1': 'Персональная информация',
					'sectionAboutHeaderText1': '\
							Имя:&nbsp;<b>Ivan</b> \
							\
							Никнейм: <b>hypotenuse</b> \
							\
							Возраст:&nbsp;<b>22</b> \
							\
							Пол:&nbsp;<b>мужской</b> \
							\
							Род деятельности:&nbsp;<b>Фронтенд разработчик</b> \
							\
							Место нахождения:&nbsp;<b>Россия, Москва</b> \
						',

					'sectionAboutHeaderName2': 'Что я знаю и какие технологии использую?',
					'sectionAboutHeaderText2': ' \
							Языки: <b>Русский, Английсий, JS</b> \
							\
							Препроцессоры: <b>SASS, SCSS</b> \
							\
							Фреймворки/Библиотеки: <b>AngularJS, JQuery, Underscore/Lo-Dash</b> \
							\
							Другие техноголии: <b>CSS, HTML, JSON/XML</b> \
							\
							Бэкэнд: <b>PHP, Node.js</b>',

					'sectionAboutHeaderName3': 'Опыт?',
					'sectionAboutHeaderText3': 'На данный момент работаю на бирже фриланса с 2014',

					'sectionAboutHeaderName4': 'Учеба?',
					'sectionAboutHeaderText4': ' \
							МГИУ. Факультет Прикладной математики и технической физики (2011 - 2013). \
							\
							НИЯУ МИФИ. Факультет Кибернетики (2013 - 2014).',

					'sectionAboutHeaderName5': 'Что я могу сделать для вашего проекта?',
					'sectionAboutHeaderText5': ' \
							Если необходимо программирование: \
							\
							Я могу решать любые фронт-енд задачи используя JS или его фреймворки/библиотеки \
							\
							Если необходима верстка: \
							\
							Я могу верстать от лендингов до многофункциональных пользовательских интерфейсов. \
							\
							При этом, верстка будет и валидной и кроссбраузерной \
						',

					'sectionAboutHeaderName6': 'Что дальше?',
					'sectionAboutHeaderText6': ' \
							Если Вы заинтересованны в предоставленной мною информации, можете со мной связаться. \
							\
							Если нет, ничего страшного. Возможно, Вы заинтересованны в чем-то другом.',

					'sectionContactName': 'Остались вопросы?',
					'sectionContactContent': ' \
							Здесь Вы можете задать вопросы. \
							\
							Просто заполните форму. И я отвечу.',

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
								text: 'Dpbox - минималистичный Date picker.',
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
						 		text: 'Это JS порт известной игры Тетрис. <br>Тетрис известен своим свойством заразительности, ненавязчивой графикой и динамичностью. Оригинальный тетрис был разработан Алексеем Пажитновым в недалеком 1984 году',
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
						 		text: 'Это JS порт известной игры Snake. <br>Механика игры проста и тривиальна - игрок маневрирует некой линией, которая растет в длинну, и которая может сгибаться. По мере маневрирования, игрок заботится о том, чтобы линия была как можно больше для того, чтобы набрать очки, при этом понимая, что чем больше линия, тем больше шансов проиграть. Главное - не врезаться в игровое поле и не съесть себя по мере того, как игрок набирает очки.',
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