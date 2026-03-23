/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Word, QuantQuestion, VerbalQuestion, ChessPuzzle } from './types';

export const GRE_WORDS: Word[] = [
  {
    id: 1,
    word: "Abate",
    pronunciation: "/əˈbeɪt/",
    pos: "verb",
    definition: "To become less active, less intense, or less in amount.",
    mnemonic: "A-bate: Think of 'rebate' which is a reduction in price.",
    example: "As the hurricane's force began to abate, residents started to assess the damage.",
    difficulty: 1,
    category: "Change"
  },
  {
    id: 2,
    word: "Aberrant",
    pronunciation: "/əˈber.ənt/",
    pos: "adj",
    definition: "Departing from an accepted standard.",
    mnemonic: "Ab-errant: 'Errant' means wandering; aberrant is wandering away from the norm.",
    example: "The aberrant behavior of the stock market puzzled even the most experienced analysts.",
    difficulty: 2,
    category: "Behavior"
  },
  {
    id: 3,
    word: "Abeyance",
    pronunciation: "/əˈbeɪ.əns/",
    pos: "noun",
    definition: "A state of temporary disuse or suspension.",
    mnemonic: "Abeyance: Sounds like 'obeyance' (waiting to obey) or 'a-bey-ance' (at the bay, waiting).",
    example: "The project was held in abeyance until the funding was secured.",
    difficulty: 3,
    category: "Time"
  },
  {
    id: 4,
    word: "Abscond",
    pronunciation: "/əbˈskɒnd/",
    pos: "verb",
    definition: "To leave hurriedly and secretly, typically to avoid detection or arrest.",
    mnemonic: "Ab-scond: 'Absent in a second'.",
    example: "The cashier absconded with the day's takings.",
    difficulty: 2,
    category: "Action"
  },
  {
    id: 5,
    word: "Abstemious",
    pronunciation: "/əbˈstiː.mi.əs/",
    pos: "adj",
    definition: "Not self-indulgent, especially when eating and drinking.",
    mnemonic: "Ab-stemious: Think 'abstain' from 'steamy' (hot/rich) food.",
    example: "He was a hard-working man with abstemious habits.",
    difficulty: 3,
    category: "Behavior"
  },
  {
    id: 6,
    word: "Admonish",
    pronunciation: "/ədˈmɒn.ɪʃ/",
    pos: "verb",
    definition: "Warn or reprimand someone firmly.",
    mnemonic: "Ad-monish: 'Add a mon' (warning) to someone.",
    example: "She admonished him for drinking too much.",
    difficulty: 1,
    category: "Speech"
  },
  {
    id: 7,
    word: "Adulterate",
    pronunciation: "/əˈdʌl.tə.reɪt/",
    pos: "verb",
    definition: "Render (something) poorer in quality by adding another substance.",
    mnemonic: "Adulterate: Making something 'adult' (corrupting its purity).",
    example: "The brewer was accused of adulterating his beer with water.",
    difficulty: 2,
    category: "Change"
  },
  {
    id: 8,
    word: "Aesthetic",
    pronunciation: "/esˈθet.ɪk/",
    pos: "adj",
    definition: "Concerned with beauty or the appreciation of beauty.",
    mnemonic: "Aesthetic: Think of 'artistic'.",
    example: "The pictures give great aesthetic pleasure.",
    difficulty: 1,
    category: "Art"
  },
  {
    id: 9,
    word: "Aggregate",
    pronunciation: "/ˈæɡ.rɪ.ɡət/",
    pos: "noun/verb",
    definition: "A whole formed by combining several separate elements.",
    mnemonic: "Aggregate: 'Add-great' (adding things to make a great whole).",
    example: "The council was an aggregate of three regional assemblies.",
    difficulty: 1,
    category: "Quantity"
  },
  {
    id: 10,
    word: "Alacrity",
    pronunciation: "/əˈlæk.rə.ti/",
    pos: "noun",
    definition: "Brisk and cheerful readiness.",
    mnemonic: "Alacrity: 'Ala-crit-y' sounds like 'at-last-city' (ready to go to the city).",
    example: "She accepted the invitation with alacrity.",
    difficulty: 2,
    category: "Behavior"
  },
  {
    id: 11,
    word: "Alleviate",
    pronunciation: "/əˈliː.vi.eɪt/",
    pos: "verb",
    definition: "Make (suffering, deficiency, or a problem) less severe.",
    mnemonic: "Alleviate: 'All-evil-ate' (eating away all the evil/pain).",
    example: "The new drug will alleviate the symptoms of the disease.",
    difficulty: 1,
    category: "Change"
  },
  {
    id: 12,
    word: "Amalgamate",
    pronunciation: "/əˈmæl.ɡə.meɪt/",
    pos: "verb",
    definition: "Combine or unite to form one organization or structure.",
    mnemonic: "Amalgamate: 'A-mal-game' (a male game where teams unite).",
    example: "The two companies amalgamated to form a new giant.",
    difficulty: 2,
    category: "Quantity"
  },
  {
    id: 13,
    word: "Ambiguous",
    pronunciation: "/æmˈbɪɡ.ju.əs/",
    pos: "adj",
    definition: "Open to more than one interpretation; not having one obvious meaning.",
    mnemonic: "Ambiguous: 'Ambi' (both) + 'guous' (guess).",
    example: "The election result was ambiguous.",
    difficulty: 1,
    category: "Logic"
  },
  {
    id: 14,
    word: "Ambivalent",
    pronunciation: "/æmˈbɪv.ə.lənt/",
    pos: "adj",
    definition: "Having mixed feelings or contradictory ideas about something or someone.",
    mnemonic: "Ambivalent: 'Ambi' (both) + 'valent' (value).",
    example: "She was ambivalent about her new job.",
    difficulty: 2,
    category: "Behavior"
  },
  {
    id: 15,
    word: "Ameliorate",
    pronunciation: "/əˈmiː.li.ə.reɪt/",
    pos: "verb",
    definition: "Make (something bad or unsatisfactory) better.",
    mnemonic: "Ameliorate: 'Am-e-lior-ate' sounds like 'improve-ate'.",
    example: "The reform did much to ameliorate living conditions.",
    difficulty: 3,
    category: "Change"
  },
  {
    id: 16,
    word: "Anachronism",
    pronunciation: "/əˈnæk.rə.nɪ.zəm/",
    pos: "noun",
    definition: "A thing belonging or appropriate to a period other than that in which it exists.",
    mnemonic: "Anachronism: 'Ana' (against) + 'chron' (time).",
    example: "The use of a sword in the modern army is an anachronism.",
    difficulty: 2,
    category: "Time"
  },
  {
    id: 17,
    word: "Analogous",
    pronunciation: "/əˈnæl.ə.ɡəs/",
    pos: "adj",
    definition: "Comparable in certain respects, typically in a way which makes clearer the nature of the things compared.",
    mnemonic: "Analogous: Think of 'analogy'.",
    example: "The wings of a bird are analogous to the arms of a human.",
    difficulty: 1,
    category: "Logic"
  },
  {
    id: 18,
    word: "Anarchy",
    pronunciation: "/ˈæn.ə.ki/",
    pos: "noun",
    definition: "A state of disorder due to absence or non-recognition of authority.",
    mnemonic: "Anarchy: 'An' (without) + 'archy' (rule).",
    example: "The country was in a state of anarchy after the revolution.",
    difficulty: 1,
    category: "Politics"
  },
  {
    id: 19,
    word: "Anomalous",
    pronunciation: "/əˈnɒm.ə.ləs/",
    pos: "adj",
    definition: "Deviating from what is standard, normal, or expected.",
    mnemonic: "Anomalous: Think of 'anomaly'.",
    example: "The anomalous results of the experiment were investigated.",
    difficulty: 2,
    category: "Logic"
  },
  {
    id: 20,
    word: "Antipathy",
    pronunciation: "/ænˈtɪp.ə.θi/",
    pos: "noun",
    definition: "A deep-seated feeling of aversion.",
    mnemonic: "Antipathy: 'Anti' (against) + 'pathy' (feeling).",
    example: "His fundamental antipathy to capitalism was well known.",
    difficulty: 2,
    category: "Behavior"
  },
  {
    id: 21,
    word: "Apathy",
    pronunciation: "/ˈæp.ə.θi/",
    pos: "noun",
    definition: "Lack of interest, enthusiasm, or concern.",
    mnemonic: "Apathy: 'A' (without) + 'pathy' (feeling).",
    example: "There is widespread apathy among the electorate.",
    difficulty: 1,
    category: "Behavior"
  },
  {
    id: 22,
    word: "Appease",
    pronunciation: "/əˈpiːz/",
    pos: "verb",
    definition: "Pacify or placate (someone) by acceding to their demands.",
    mnemonic: "Appease: Think of 'please'.",
    example: "Amendments have been added to appease local opposition.",
    difficulty: 1,
    category: "Speech"
  },
  {
    id: 23,
    word: "Apprise",
    pronunciation: "/əˈpraɪz/",
    pos: "verb",
    definition: "Inform or tell (someone).",
    mnemonic: "Apprise: 'App-rise' (rising to inform).",
    example: "I thought it right to apprise Chris of what had happened.",
    difficulty: 2,
    category: "Speech"
  },
  {
    id: 24,
    word: "Approbation",
    pronunciation: "/ˌæp.rəˈbeɪ.ʃən/",
    pos: "noun",
    definition: "Approval or praise.",
    mnemonic: "Approbation: Think of 'approval'.",
    example: "The opera met with high approbation.",
    difficulty: 3,
    category: "Speech"
  },
  {
    id: 25,
    word: "Appropriate",
    pronunciation: "/əˈprəʊ.pri.ət/",
    pos: "verb",
    definition: "Take (something) for one's own use, typically without the owner's permission.",
    mnemonic: "Appropriate: 'App-rop-riate' (robbing for one's own use).",
    example: "The government appropriated the land for a new road.",
    difficulty: 2,
    category: "Action"
  },
  {
    id: 26,
    word: "Arduous",
    pronunciation: "/ˈɑː.dju.əs/",
    pos: "adj",
    definition: "Involving or requiring strenuous effort; difficult and tiring.",
    mnemonic: "Arduous: 'Hard-u-ous'.",
    example: "The journey was arduous and dangerous.",
    difficulty: 2,
    category: "Action"
  },
  {
    id: 27,
    word: "Artless",
    pronunciation: "/ˈɑːt.ləs/",
    pos: "adj",
    definition: "Without guile or deception; without effort or pretentiousness.",
    mnemonic: "Artless: 'Without art' (without trickery).",
    example: "Her artless beauty was refreshing.",
    difficulty: 2,
    category: "Behavior"
  },
  {
    id: 28,
    word: "Ascetic",
    pronunciation: "/əˈset.ɪk/",
    pos: "adj/noun",
    definition: "Characterized by severe self-discipline and abstention from all forms of indulgence.",
    mnemonic: "Ascetic: 'A-ske-tic' (someone who skips indulgences).",
    example: "The monks lived an ascetic life.",
    difficulty: 3,
    category: "Behavior"
  },
  {
    id: 29,
    word: "Assiduous",
    pronunciation: "/əˈsɪd.ju.əs/",
    pos: "adj",
    definition: "Showing great care and perseverance.",
    mnemonic: "Assiduous: 'As-sid-u-ous' (someone who sits and works).",
    example: "She was assiduous in her duties.",
    difficulty: 3,
    category: "Behavior"
  },
  {
    id: 30,
    word: "Assuage",
    pronunciation: "/əˈsweɪdʒ/",
    pos: "verb",
    definition: "Make (an unpleasant feeling) less intense.",
    mnemonic: "Assuage: 'As-suage' sounds like 'as-sweet' (making it sweet/less bitter).",
    example: "The letter assuaged her fears.",
    difficulty: 3,
    category: "Change"
  },
  {
    id: 31,
    word: "Attenuate",
    pronunciation: "/əˈten.ju.eɪt/",
    pos: "verb",
    definition: "Reduce the force, effect, or value of.",
    mnemonic: "Attenuate: 'At-ten-u-ate' (at ten percent of its original strength).",
    example: "The drug attenuates the effects of the virus.",
    difficulty: 3,
    category: "Change"
  },
  {
    id: 32,
    word: "Audacious",
    pronunciation: "/ɔːˈdeɪ.ʃəs/",
    pos: "adj",
    definition: "Showing a willingness to take surprisingly bold risks.",
    mnemonic: "Audacious: 'Aud-acious' (someone who acts in an auditorium).",
    example: "The plan was audacious and risky.",
    difficulty: 2,
    category: "Behavior"
  },
  {
    id: 33,
    word: "Austere",
    pronunciation: "/ɔːˈstɪər/",
    pos: "adj",
    definition: "Severe or strict in manner, attitude, or appearance.",
    mnemonic: "Austere: 'Aus-tere' (someone who is tearless/severe).",
    example: "The building was austere and functional.",
    difficulty: 2,
    category: "Behavior"
  },
  {
    id: 34,
    word: "Aver",
    pronunciation: "/əˈvɜːr/",
    pos: "verb",
    definition: "State or assert to be the case.",
    mnemonic: "Aver: 'A-ver' (a-verify).",
    example: "He averred that he was innocent.",
    difficulty: 3,
    category: "Speech"
  },
  {
    id: 35,
    word: "Banal",
    pronunciation: "/bəˈnɑːl/",
    pos: "adj",
    definition: "So lacking in originality as to be obvious and boring.",
    mnemonic: "Banal: 'Ban-all' (ban all boring things).",
    example: "The movie was banal and predictable.",
    difficulty: 2,
    category: "Logic"
  },
  {
    id: 36,
    word: "Belie",
    pronunciation: "/bɪˈlaɪ/",
    pos: "verb",
    definition: "Fail to give a true notion or impression of (something); disguise or contradict.",
    mnemonic: "Belie: 'Be-lie' (being a lie).",
    example: "His lively manner belied his age.",
    difficulty: 3,
    category: "Logic"
  },
  {
    id: 37,
    word: "Beneficent",
    pronunciation: "/bəˈnef.ɪ.sənt/",
    pos: "adj",
    definition: "Generous or doing good.",
    mnemonic: "Beneficent: 'Bene' (good) + 'ficent' (doing).",
    example: "The beneficent donor gave a large sum to the hospital.",
    difficulty: 2,
    category: "Behavior"
  },
  {
    id: 38,
    word: "Bolster",
    pronunciation: "/ˈbəʊl.stər/",
    pos: "verb",
    definition: "Support or strengthen; prop up.",
    mnemonic: "Bolster: Think of a 'bolster' pillow.",
    example: "The evidence bolstered his case.",
    difficulty: 1,
    category: "Action"
  },
  {
    id: 39,
    word: "Bombastic",
    pronunciation: "/bɒmˈbæs.tɪk/",
    pos: "adj",
    definition: "High-sounding but with little meaning; inflated.",
    mnemonic: "Bombastic: 'Bomb-astic' (full of bombs/hot air).",
    example: "His speech was bombastic and empty.",
    difficulty: 3,
    category: "Speech"
  },
  {
    id: 40,
    word: "Boorish",
    pronunciation: "/ˈbʊə.rɪʃ/",
    pos: "adj",
    definition: "Rough and bad-mannered; coarse.",
    mnemonic: "Boorish: 'Boor-ish' (like a boor/pig).",
    example: "His boorish behavior was unacceptable.",
    difficulty: 2,
    category: "Behavior"
  },
  {
    id: 41,
    word: "Burgeon",
    pronunciation: "/ˈbɜː.dʒən/",
    pos: "verb",
    definition: "Begin to grow or increase rapidly; flourish.",
    mnemonic: "Burgeon: 'Bur-geon' (like a burger growing).",
    example: "The city burgeoned in the late 19th century.",
    difficulty: 2,
    category: "Change"
  },
  {
    id: 42,
    word: "Burnish",
    pronunciation: "/ˈbɜː.nɪʃ/",
    pos: "verb",
    definition: "Polish (something, especially metal) by rubbing.",
    mnemonic: "Burnish: 'Bur-nish' (making it burn/shine).",
    example: "He burnished the silver until it shone.",
    difficulty: 3,
    category: "Action"
  },
  {
    id: 43,
    word: "Buttress",
    pronunciation: "/ˈbʌt.rəs/",
    pos: "verb/noun",
    definition: "A source of defense or support.",
    mnemonic: "Buttress: 'Butt-ress' (supporting the butt/base).",
    example: "The argument was buttressed by solid evidence.",
    difficulty: 2,
    category: "Action"
  },
  {
    id: 44,
    word: "Cacophonous",
    pronunciation: "/kəˈkɒf.ə.nəs/",
    pos: "adj",
    definition: "Involving or producing a harsh, discordant mixture of sounds.",
    mnemonic: "Cacophonous: 'Caco' (bad) + 'phon' (sound).",
    example: "The cacophonous noise from the construction site was deafening.",
    difficulty: 3,
    category: "Art"
  },
  {
    id: 45,
    word: "Capricious",
    pronunciation: "/kəˈprɪʃ.əs/",
    pos: "adj",
    definition: "Given to sudden and unaccountable changes of mood or behavior.",
    mnemonic: "Capricious: 'Capri-cious' (like a car changing direction).",
    example: "The weather in the mountains is capricious.",
    difficulty: 3,
    category: "Behavior"
  },
  {
    id: 46,
    word: "Castigation",
    pronunciation: "/ˌkæs.tɪˈɡeɪ.ʃən/",
    pos: "noun",
    definition: "Severe reprimand or punishment.",
    mnemonic: "Castigation: 'Cast-igation' (casting someone out/punishing).",
    example: "The castigation of the criminal was swift.",
    difficulty: 3,
    category: "Speech"
  },
  {
    id: 47,
    word: "Catalyst",
    pronunciation: "/ˈkæt.əl.ɪst/",
    pos: "noun",
    definition: "A substance that increases the rate of a chemical reaction without itself undergoing any permanent chemical change.",
    mnemonic: "Catalyst: Think of a chemical catalyst.",
    example: "The event was a catalyst for change.",
    difficulty: 1,
    category: "Change"
  },
  {
    id: 48,
    word: "Caustic",
    pronunciation: "/ˈkɔː.stɪk/",
    pos: "adj",
    definition: "Sarcastic in a scathing and bitter way.",
    mnemonic: "Caustic: 'Cau-stic' (causing a sting).",
    example: "His caustic remarks were hurtful.",
    difficulty: 2,
    category: "Speech"
  },
  {
    id: 49,
    word: "Chicanery",
    pronunciation: "/ʃɪˈkeɪ.nər.i/",
    pos: "noun",
    definition: "The use of trickery to achieve a political, financial, or legal purpose.",
    mnemonic: "Chicanery: 'Chi-can-ery' (chicken trickery).",
    example: "The politician was accused of chicanery.",
    difficulty: 3,
    category: "Action"
  },
  {
    id: 50,
    word: "Coagulate",
    pronunciation: "/kəʊˈæɡ.jə.leɪt/",
    pos: "verb",
    definition: "Change from a fluid to a solid or semi-solid state.",
    mnemonic: "Coagulate: Think of blood coagulating.",
    example: "The blood began to coagulate.",
    difficulty: 2,
    category: "Change"
  },
  {
    id: 51,
    word: "Coda",
    pronunciation: "/ˈkəʊ.də/",
    pos: "noun",
    definition: "The concluding passage of a piece or movement, typically forming an addition to the basic structure.",
    mnemonic: "Coda: 'Co-da' (concluding data).",
    example: "The movie's coda was unexpected.",
    difficulty: 3,
    category: "Art"
  },
  {
    id: 52,
    word: "Cogent",
    pronunciation: "/ˈkəʊ.dʒənt/",
    pos: "adj",
    definition: "(of an argument or case) clear, logical, and convincing.",
    mnemonic: "Cogent: 'Co-gent' (convincing gent).",
    example: "His argument was cogent and persuasive.",
    difficulty: 3,
    category: "Logic"
  },
  {
    id: 53,
    word: "Commensurate",
    pronunciation: "/kəˈmen.sjər.ət/",
    pos: "adj",
    definition: "Corresponding in size or degree; in proportion.",
    mnemonic: "Commensurate: 'Com-mensur-ate' (common measure).",
    example: "The salary will be commensurate with experience.",
    difficulty: 3,
    category: "Quantity"
  },
  {
    id: 54,
    word: "Compendium",
    pronunciation: "/kəmˈpen.di.əm/",
    pos: "noun",
    definition: "A collection of concise but detailed information about a particular subject, especially in a book or other publication.",
    mnemonic: "Compendium: 'Com-pend-ium' (complete pending information).",
    example: "The book is a compendium of historical facts.",
    difficulty: 3,
    category: "Art"
  },
  {
    id: 55,
    word: "Complaisant",
    pronunciation: "/kəmˈpleɪ.zənt/",
    pos: "adj",
    definition: "Willing to please others; obliging; agreeable.",
    mnemonic: "Complaisant: 'Com-plais-ant' (completely pleasant).",
    example: "She was complaisant and easy to work with.",
    difficulty: 3,
    category: "Behavior"
  },
  {
    id: 56,
    word: "Compliant",
    pronunciation: "/kəmˈplaɪ.ənt/",
    pos: "adj",
    definition: "Inclined to agree with others or obey rules, especially to an excessive degree; acquiescent.",
    mnemonic: "Compliant: Think of 'comply'.",
    example: "The patient was compliant with the doctor's orders.",
    difficulty: 1,
    category: "Behavior"
  },
  {
    id: 57,
    word: "Conciliatory",
    pronunciation: "/kənˈsɪl.i.ə.tər.i/",
    pos: "adj",
    definition: "Intended or likely to placate or pacify.",
    mnemonic: "Conciliatory: 'Con-cili-atory' (completely silly/pacifying).",
    example: "His tone was conciliatory and apologetic.",
    difficulty: 2,
    category: "Speech"
  },
  {
    id: 58,
    word: "Condone",
    pronunciation: "/kənˈdəʊn/",
    pos: "verb",
    definition: "Accept and allow (behavior that is considered morally wrong or offensive) to continue.",
    mnemonic: "Condone: 'Con-done' (completely done/accepted).",
    example: "The college cannot condone any behavior that involves drugs.",
    difficulty: 1,
    category: "Behavior"
  },
  {
    id: 59,
    word: "Confound",
    pronunciation: "/kənˈfaʊnd/",
    pos: "verb",
    definition: "Cause surprise or confusion in (someone), especially by acting against their expectations.",
    mnemonic: "Confound: 'Con-found' (completely found/confused).",
    example: "The results confounded the experts.",
    difficulty: 2,
    category: "Logic"
  },
  {
    id: 60,
    word: "Connoisseur",
    pronunciation: "/ˌkɒn.əˈsɜːr/",
    pos: "noun",
    definition: "An expert judge in matters of taste.",
    mnemonic: "Connoisseur: 'Con-nois-seur' (completely noise/expert).",
    example: "He was a connoisseur of fine wines.",
    difficulty: 2,
    category: "Art"
  },
  {
    id: 61,
    word: "Contention",
    pronunciation: "/kənˈten.ʃən/",
    pos: "noun",
    definition: "Heated disagreement.",
    mnemonic: "Contention: Think of 'contentious'.",
    example: "The issue was a source of contention.",
    difficulty: 2,
    category: "Speech"
  },
  {
    id: 62,
    word: "Contentious",
    pronunciation: "/kənˈten.ʃəs/",
    pos: "adj",
    definition: "Causing or likely to cause an argument; controversial.",
    mnemonic: "Contentious: 'Con-ten-tious' (completely tense).",
    example: "The contentious issue was debated for hours.",
    difficulty: 2,
    category: "Speech"
  },
  {
    id: 63,
    word: "Contrite",
    pronunciation: "/kənˈtraɪt/",
    pos: "adj",
    definition: "Feeling or expressing remorse or penitence; affected by guilt.",
    mnemonic: "Contrite: 'Con-trite' (completely trite/remorseful).",
    example: "He was contrite and apologetic.",
    difficulty: 3,
    category: "Behavior"
  },
  {
    id: 64,
    word: "Conundrum",
    pronunciation: "/kəˈnʌn.drəm/",
    pos: "noun",
    definition: "A confusing and difficult problem or question.",
    mnemonic: "Conundrum: 'Con-un-drum' (completely un-drum/confusing).",
    example: "The conundrum was difficult to solve.",
    difficulty: 2,
    category: "Logic"
  },
  {
    id: 65,
    word: "Converge",
    pronunciation: "/kənˈvɜːdʒ/",
    pos: "verb",
    definition: "(of several people or things) come together from different directions so as eventually to meet.",
    mnemonic: "Converge: 'Con-verge' (completely verge/meet).",
    example: "The two paths converge at the top of the hill.",
    difficulty: 1,
    category: "Action"
  },
  {
    id: 66,
    word: "Convoluted",
    pronunciation: "/ˈkɒn.və.luː.tɪd/",
    pos: "adj",
    definition: "(especially of an argument, story, or sentence) extremely complex and difficult to follow.",
    mnemonic: "Convoluted: 'Con-vol-uted' (completely volume/complex).",
    example: "The story was convoluted and hard to follow.",
    difficulty: 2,
    category: "Logic"
  },
  {
    id: 67,
    word: "Craven",
    pronunciation: "/ˈkreɪ.vən/",
    pos: "adj",
    definition: "Contemptibly lacking in courage; cowardly.",
    mnemonic: "Craven: 'Cra-ven' (completely raven/cowardly).",
    example: "His craven behavior was shameful.",
    difficulty: 3,
    category: "Behavior"
  },
  {
    id: 68,
    word: "Daunt",
    pronunciation: "/dɔːnt/",
    pos: "verb",
    definition: "Make (someone) feel intimidated or apprehensive.",
    mnemonic: "Daunt: 'Daunt' sounds like 'haunt'.",
    example: "The task was daunting and difficult.",
    difficulty: 2,
    category: "Behavior"
  },
  {
    id: 69,
    word: "Decorum",
    pronunciation: "/dɪˈkɔː.rəm/",
    pos: "noun",
    definition: "Behavior in keeping with good taste and propriety.",
    mnemonic: "Decorum: 'De-corum' (completely decorum/taste).",
    example: "His decorum was impeccable.",
    difficulty: 2,
    category: "Behavior"
  },
  {
    id: 70,
    word: "Default",
    pronunciation: "/dɪˈfɔːlt/",
    pos: "verb/noun",
    definition: "Failure to fulfill an obligation, especially to repay a loan or appear in a court of law.",
    mnemonic: "Default: Think of 'default' settings.",
    example: "The company defaulted on its loan.",
    difficulty: 1,
    category: "Action"
  },
  {
    id: 71,
    word: "Deference",
    pronunciation: "/ˈdef.ər.əns/",
    pos: "noun",
    definition: "Humble submission and respect.",
    mnemonic: "Deference: 'De-ference' (completely difference/respect).",
    example: "He showed deference to his elders.",
    difficulty: 2,
    category: "Behavior"
  },
  {
    id: 72,
    word: "Delineate",
    pronunciation: "/dɪˈlɪn.i.eɪt/",
    pos: "verb",
    definition: "Describe or portray (something) precisely.",
    mnemonic: "Delineate: 'De-line-ate' (completely line/describe).",
    example: "The report delineated the project's goals.",
    difficulty: 3,
    category: "Speech"
  },
  {
    id: 73,
    word: "Denigrate",
    pronunciation: "/ˈden.ɪ.ɡreɪt/",
    pos: "verb",
    definition: "Criticize unfairly; disparage.",
    mnemonic: "Denigrate: 'De-nig-rate' (completely negative/criticize).",
    example: "The politician denigrated his opponent.",
    difficulty: 3,
    category: "Speech"
  },
  {
    id: 74,
    word: "Deride",
    pronunciation: "/dɪˈraɪd/",
    pos: "verb",
    definition: "Express contempt for; ridicule.",
    mnemonic: "Deride: 'De-ride' (completely ride/ridicule).",
    example: "The critics derided the new movie.",
    difficulty: 3,
    category: "Speech"
  },
  {
    id: 75,
    word: "Derivative",
    pronunciation: "/dɪˈrɪv.ə.tɪv/",
    pos: "adj",
    definition: "(typically of an artist or work of art) imitative of the work of another person, and usually disapproved of for that reason.",
    mnemonic: "Derivative: Think of 'derive'.",
    example: "The movie was derivative and unoriginal.",
    difficulty: 1,
    category: "Art"
  },
  {
    id: 76,
    word: "Desiccate",
    pronunciation: "/ˈdes.ɪ.keɪt/",
    pos: "verb",
    definition: "Remove the moisture from (something, especially food), typically in order to preserve it.",
    mnemonic: "Desiccate: 'De-sic-cate' (completely sick/dry).",
    example: "The fruit was desiccated and preserved.",
    difficulty: 3,
    category: "Change"
  },
  {
    id: 77,
    word: "Desultory",
    pronunciation: "/ˈdes.əl.tər.i/",
    pos: "adj",
    definition: "Lacking a plan, purpose, or enthusiasm.",
    mnemonic: "Desultory: 'De-sult-ory' (completely salt/lacking plan).",
    example: "The conversation was desultory and aimless.",
    difficulty: 3,
    category: "Logic"
  },
  {
    id: 78,
    word: "Deterrent",
    pronunciation: "/dɪˈter.ənt/",
    pos: "noun",
    definition: "A thing that discourages or is intended to discourage someone from doing something.",
    mnemonic: "Deterrent: Think of 'deter'.",
    example: "The punishment was a deterrent to others.",
    difficulty: 1,
    category: "Action"
  },
  {
    id: 79,
    word: "Diatribe",
    pronunciation: "/ˈdaɪ.ə.traɪb/",
    pos: "noun",
    definition: "A forceful and bitter verbal attack against someone or something.",
    mnemonic: "Diatribe: 'Dia-tribe' (completely tribe/attack).",
    example: "His diatribe against the government was well known.",
    difficulty: 3,
    category: "Speech"
  },
  {
    id: 80,
    word: "Dichotomy",
    pronunciation: "/daɪˈkɒt.ə.mi/",
    pos: "noun",
    definition: "A division or contrast between two things that are or are represented as being opposed or entirely different.",
    mnemonic: "Dichotomy: 'Di-chotomy' (completely cut/division).",
    example: "The dichotomy between good and evil was explored.",
    difficulty: 2,
    category: "Logic"
  },
  {
    id: 81,
    word: "Diffidence",
    pronunciation: "/ˈdɪf.ɪ.dəns/",
    pos: "noun",
    definition: "Modesty or shyness resulting from a lack of self-confidence.",
    mnemonic: "Diffidence: 'Dif-fidence' (completely confidence/shyness).",
    example: "His diffidence was mistaken for arrogance.",
    difficulty: 3,
    category: "Behavior"
  },
  {
    id: 82,
    word: "Diffuse",
    pronunciation: "/dɪˈfjuːz/",
    pos: "verb/adj",
    definition: "Spread or cause to spread over a wide area or among a large number of people.",
    mnemonic: "Diffuse: Think of 'diffuse' light.",
    example: "The light was diffuse and soft.",
    difficulty: 1,
    category: "Action"
  },
  {
    id: 83,
    word: "Digression",
    pronunciation: "/daɪˈɡreʃ.ən/",
    pos: "noun",
    definition: "A temporary departure from the main subject in speech or writing.",
    mnemonic: "Digression: Think of 'digress'.",
    example: "The digression was interesting but irrelevant.",
    difficulty: 2,
    category: "Speech"
  },
  {
    id: 84,
    word: "Dirge",
    pronunciation: "/dɜːdʒ/",
    pos: "noun",
    definition: "A lament for the dead, especially one forming part of a funeral rite.",
    mnemonic: "Dirge: 'Dir-ge' (completely dead/lament).",
    example: "The dirge was sung at the funeral.",
    difficulty: 3,
    category: "Art"
  },
  {
    id: 85,
    word: "Disabuse",
    pronunciation: "/ˌdɪs.əˈbjuːz/",
    pos: "verb",
    definition: "Persuade (someone) that an idea or belief is mistaken.",
    mnemonic: "Disabuse: 'Dis-abuse' (completely abuse/persuade).",
    example: "I was disabused of my mistaken belief.",
    difficulty: 3,
    category: "Logic"
  },
  {
    id: 86,
    word: "Discerning",
    pronunciation: "/dɪˈsɜː.nɪŋ/",
    pos: "adj",
    definition: "Having or showing good judgment.",
    mnemonic: "Discerning: Think of 'discern'.",
    example: "The discerning customer chose the best product.",
    difficulty: 2,
    category: "Logic"
  },
  {
    id: 87,
    word: "Discordant",
    pronunciation: "/dɪˈskɔː.dənt/",
    pos: "adj",
    definition: "Disagreeing or incongruous.",
    mnemonic: "Discordant: Think of 'discord'.",
    example: "The discordant notes were jarring.",
    difficulty: 2,
    category: "Art"
  },
  {
    id: 88,
    word: "Discredit",
    pronunciation: "/dɪˈskred.ɪt/",
    pos: "verb",
    definition: "Harm the good reputation of (someone or something).",
    mnemonic: "Discredit: Think of 'credit'.",
    example: "The report discredited his claims.",
    difficulty: 1,
    category: "Speech"
  },
  {
    id: 89,
    word: "Discrepancy",
    pronunciation: "/dɪˈskrep.ən.si/",
    pos: "noun",
    definition: "A lack of compatibility or similarity between two or more facts.",
    mnemonic: "Discrepancy: 'Dis-crepancy' (completely crepancy/difference).",
    example: "The discrepancy between the two reports was investigated.",
    difficulty: 2,
    category: "Logic"
  },
  {
    id: 90,
    word: "Discrete",
    pronunciation: "/dɪˈskriːt/",
    pos: "adj",
    definition: "Individually separate and distinct.",
    mnemonic: "Discrete: 'Dis-crete' (completely separate).",
    example: "The two issues are discrete and separate.",
    difficulty: 2,
    category: "Logic"
  }
];

export const GRE_QUANT: QuantQuestion[] = [
  {
    id: 1,
    type: "QC",
    difficulty: 1,
    topic: "Arithmetic",
    colA: "0.125",
    colB: "1/8",
    answer: "C",
    explanation: "0.125 is equal to 125/1000, which simplifies to 1/8. Therefore, the two quantities are equal."
  },
  {
    id: 2,
    type: "MC",
    difficulty: 2,
    topic: "Algebra",
    question: "If 3x + 5 = 20, what is the value of x?",
    options: ["3", "5", "15", "20", "25"],
    answer: "5",
    explanation: "Subtract 5 from both sides: 3x = 15. Divide by 3: x = 5."
  },
  {
    id: 3,
    type: "NE",
    difficulty: 3,
    topic: "Geometry",
    question: "A circle has a radius of 5. What is its area? (Use π = 3.14)",
    answer: "78.5",
    explanation: "Area = πr² = 3.14 * 5² = 3.14 * 25 = 78.5."
  },
  {
    id: 4,
    type: "QC",
    difficulty: 2,
    topic: "Data Analysis",
    colA: "The average of 10, 20, 30",
    colB: "20",
    answer: "C",
    explanation: "Average = (10 + 20 + 30) / 3 = 60 / 3 = 20. Therefore, the two quantities are equal."
  },
  {
    id: 5,
    type: "MC",
    difficulty: 3,
    topic: "Arithmetic",
    question: "What is 20% of 50% of 200?",
    options: ["10", "20", "40", "50", "100"],
    answer: "20",
    explanation: "50% of 200 is 100. 20% of 100 is 20."
  },
  {
    id: 6,
    type: "NE",
    difficulty: 2,
    topic: "Algebra",
    question: "If y = 2x - 3 and x = 4, what is the value of y?",
    answer: "5",
    explanation: "y = 2(4) - 3 = 8 - 3 = 5."
  },
  {
    id: 7,
    type: "QC",
    difficulty: 3,
    topic: "Geometry",
    colA: "The perimeter of a square with side 5",
    colB: "The circumference of a circle with radius 3",
    answer: "A",
    explanation: "Perimeter of square = 4 * 5 = 20. Circumference of circle = 2πr = 2 * 3.14 * 3 = 18.84. Quantity A is greater."
  },
  {
    id: 8,
    type: "MC",
    difficulty: 1,
    topic: "Data Analysis",
    question: "If a set of numbers is {2, 4, 6, 8, 10}, what is the median?",
    options: ["2", "4", "6", "8", "10"],
    answer: "6",
    explanation: "The median is the middle value in a sorted set. In this case, it is 6."
  },
  {
    id: 9,
    type: "NE",
    difficulty: 3,
    topic: "Arithmetic",
    question: "What is the value of 2^5?",
    answer: "32",
    explanation: "2^5 = 2 * 2 * 2 * 2 * 2 = 32."
  },
  {
    id: 10,
    type: "QC",
    difficulty: 2,
    topic: "Algebra",
    colA: "x + y",
    colB: "x - y",
    question: "If y > 0",
    answer: "A",
    explanation: "Since y > 0, adding y to x will always result in a larger value than subtracting y from x. Quantity A is greater."
  },
  {
    id: 11,
    type: "MC",
    difficulty: 3,
    topic: "Geometry",
    question: "A triangle has sides of length 3, 4, and 5. What is its area?",
    options: ["6", "10", "12", "15", "20"],
    answer: "6",
    explanation: "This is a right triangle (3² + 4² = 5²). Area = (1/2) * base * height = (1/2) * 3 * 4 = 6."
  },
  {
    id: 12,
    type: "NE",
    difficulty: 2,
    topic: "Data Analysis",
    question: "If the probability of an event is 0.25, what is the probability of the event NOT occurring?",
    answer: "0.75",
    explanation: "Probability of NOT occurring = 1 - 0.25 = 0.75."
  },
  {
    id: 13,
    type: "QC",
    difficulty: 3,
    topic: "Arithmetic",
    colA: "10!",
    colB: "10^10",
    answer: "B",
    explanation: "10! = 10 * 9 * 8 * 7 * 6 * 5 * 4 * 3 * 2 * 1 = 3,628,800. 10^10 = 10,000,000,000. Quantity B is much greater."
  },
  {
    id: 14,
    type: "MC",
    difficulty: 2,
    topic: "Algebra",
    question: "If x^2 = 16, what are the possible values of x?",
    options: ["4", "-4", "4 and -4", "16", "8"],
    answer: "4 and -4",
    explanation: "Both 4² and (-4)² equal 16."
  },
  {
    id: 15,
    type: "NE",
    difficulty: 3,
    topic: "Geometry",
    question: "A cube has a side length of 3. What is its volume?",
    answer: "27",
    explanation: "Volume = side³ = 3³ = 27."
  },
  {
    id: 16,
    type: "QC",
    difficulty: 2,
    topic: "Data Analysis",
    colA: "The range of {1, 2, 3, 4, 5}",
    colB: "4",
    answer: "C",
    explanation: "Range = max - min = 5 - 1 = 4. Therefore, the two quantities are equal."
  },
  {
    id: 17,
    type: "MC",
    difficulty: 3,
    topic: "Arithmetic",
    question: "What is the smallest prime number greater than 10?",
    options: ["11", "13", "17", "19", "23"],
    answer: "11",
    explanation: "The prime numbers greater than 10 are 11, 13, 17, 19, 23... The smallest is 11."
  },
  {
    id: 18,
    type: "NE",
    difficulty: 2,
    topic: "Algebra",
    question: "If 2x + 3y = 12 and x = 3, what is the value of y?",
    answer: "2",
    explanation: "2(3) + 3y = 12 => 6 + 3y = 12 => 3y = 6 => y = 2."
  },
  {
    id: 19,
    type: "QC",
    difficulty: 3,
    topic: "Geometry",
    colA: "The area of a rectangle with sides 4 and 6",
    colB: "The area of a square with side 5",
    answer: "B",
    explanation: "Area of rectangle = 4 * 6 = 24. Area of square = 5 * 5 = 25. Quantity B is greater."
  },
  {
    id: 20,
    type: "MC",
    difficulty: 1,
    topic: "Data Analysis",
    question: "If a coin is flipped twice, what is the probability of getting two heads?",
    options: ["1/2", "1/4", "1/8", "1/16", "1"],
    answer: "1/4",
    explanation: "The possible outcomes are HH, HT, TH, TT. Only HH is two heads. Probability = 1/4."
  }
];

export const GRE_VERBAL: VerbalQuestion[] = [
  {
    id: 1,
    type: "TC",
    blanks: 1,
    sentence: "The professor's lecture was so ________ that many students found it difficult to stay awake.",
    options: ["stimulating", "tedious", "enlightening", "concise", "profound"],
    answers: ["tedious"],
    explanation: "The sentence suggests that the lecture was boring, which is why students were falling asleep. 'Tedious' means boring and too slow or long."
  },
  {
    id: 2,
    type: "SE",
    sentence: "The politician's speech was ________, filled with empty promises and vague rhetoric.",
    options: ["bombastic", "pompous", "lucid", "concise", "profound", "cogent"],
    answers: ["bombastic", "pompous"],
    explanation: "The sentence suggests the speech was high-sounding but empty. 'Bombastic' and 'pompous' both describe this kind of language."
  },
  {
    id: 3,
    type: "RC",
    passage: "The Industrial Revolution was a period of major industrialization that took place during the late 1700s and early 1800s. The Industrial Revolution began in Great Britain and quickly spread throughout the world. This period saw the mechanization of agriculture and textile manufacturing and a revolution in power, including steamships and railroads, that effected social, cultural and economic conditions.",
    questions: [
      {
        q: "Where did the Industrial Revolution begin?",
        options: ["France", "Germany", "Great Britain", "United States", "China"],
        answer: "Great Britain",
        explanation: "The passage explicitly states that the Industrial Revolution began in Great Britain."
      },
      {
        q: "What was one of the key developments during this period?",
        options: ["The invention of the internet", "The mechanization of agriculture", "The discovery of electricity", "The rise of social media", "The end of the monarchy"],
        answer: "The mechanization of agriculture",
        explanation: "The passage mentions the mechanization of agriculture as a key development."
      }
    ],
    explanation: "This passage describes the origins and key features of the Industrial Revolution."
  },
  {
    id: 4,
    type: "TC",
    blanks: 2,
    sentence: "Despite the ________ of the evidence, the jury remained ________, unable to reach a verdict.",
    options: [
      ["paucity", "abundance", "clarity"],
      ["unanimous", "divided", "certain"]
    ],
    answers: ["abundance", "divided"],
    explanation: "The sentence suggests a contrast. Even though there was a lot of evidence ('abundance'), the jury couldn't agree ('divided')."
  },
  {
    id: 5,
    type: "SE",
    sentence: "The new manager was known for her ________, always willing to listen to her employees' concerns.",
    options: ["complaisance", "agreeableness", "arrogance", "diffidence", "apathy", "antipathy"],
    answers: ["complaisance", "agreeableness"],
    explanation: "The sentence suggests the manager was willing to please or agree. 'Complaisance' and 'agreeableness' fit this description."
  }
];

export const CHESS_PUZZLES: ChessPuzzle[] = [
  {
    id: 1,
    title: "Back Rank Mate",
    difficulty: "Easy",
    description: "White to move and mate in 1.",
    position: "r5k1/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1",
    solution: "Ra8#",
    explanation: "The black king is trapped on the back rank by its own pawns. The white rook moves to a8 to deliver checkmate."
  },
  {
    id: 2,
    title: "Smothered Mate",
    difficulty: "Medium",
    description: "White to move and mate in 2.",
    position: "6rk/5Npp/8/8/8/8/8/7K w - - 0 1",
    solution: "Nf7#",
    explanation: "The black king is completely surrounded by its own pieces. The white knight moves to f7 to deliver a smothered mate."
  }
];
