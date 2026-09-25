// focus-area-content.jsx — result interpretation copy for "Find Your Focus Area".
//
// Structured content only: no markup, no components, no scoring. The result
// page (focus-area.jsx) assembles it from the stored result state:
//
//   resultContent[primaryFocusArea].personaContext[persona]  → contextual paragraph
//   resultContent[primaryFocusArea] core sections            → core interpretation
//   resultContent[secondaryFocusArea].secondaryCopy          → "Also showing up"
//
// Keys are the stable Focus Area ids from focus-area-data.jsx and the stable
// persona ids (founder, freelancer, professional). Paragraph fields are arrays
// of paragraphs; howThisMayShowUp is an array of list items.
//
// The copy is approved as written. It describes patterns in the answers and
// deliberately avoids claiming causes: keep that register if it is ever edited.

window.FOCUS_AREA_CONTENT = function () {
  // UI labels used around the copy.
  var labels = {
    focusArea: 'Your Focus Area',
    focusAreas: 'Your Focus Areas',
    closeLead: 'Two areas are showing up strongly:',
    situation: 'Your situation',
    whatThisMeans: 'What this means',
    howThisMayShowUp: 'How this may be showing up',
    whatDeservesAttentionFirst: 'What deserves attention first',
    whatToKeepInMind: 'What to keep in mind',
    alsoShowingUp: 'Also showing up',
    scores: 'Your Focus Areas',
    scoresClose: 'All Focus Area scores'
  };
  var resultContent = {
    direction: {
      title: 'Direction',
      personaContext: {
        founder: 'In the business situation you described, some of the difficulty may come from not being clear enough about what you actually want the business to become. Growth, income, freedom and scale can pull the business in very different directions, so a strategy can look wrong when the underlying objective is still moving.',
        freelancer: 'In the situation you described, the next tactic may matter less than deciding what kind of working life you want the business to support. More clients, higher prices and a larger operation can each improve one part of the business while making another part less attractive.',
        professional: 'In your career situation, you seem to know that something needs to change, while the alternative may still be too vague to evaluate confidently. Wanting to leave a situation gives useful information, but it does not automatically tell you what should replace it.'
      },
      whatThisMeans: ['Your answers suggest that the destination is still unclear enough to make the next step difficult to judge.', 'You do not need a detailed five-year plan. You need enough clarity to see the next stretch of road. Without that, almost any option can look reasonable for a while, and new information can keep changing the answer.', 'This often happens when someone knows what they want to get away from more clearly than what they want to move towards. Research can then create the feeling of progress without resolving the underlying question.'],
      howThisMayShowUp: ['You keep researching without feeling much closer to a decision.', 'You can explain what you dislike more easily than what you want.', 'Your preferred direction changes after speaking to different people.', 'You often evaluate options through what you think you should want.', 'You are improving parts of a situation you are not sure you want to keep.'],
      whatDeservesAttentionFirst: ['Try to describe the change you want before deciding how to create it.', 'Start with the experience rather than the title, business model or tactic. What would you want more of in an ordinary week? What would you want less of? What would need to feel meaningfully different for you to say that the situation had improved?', 'A clearer direction makes later questions about strategy much easier to answer.'],
      whatToKeepInMind: ['Uncertainty can also appear when the direction is already reasonably clear but choosing it carries risk. If you know what you want and repeatedly reopen the decision, Self-trust or Action may deserve more attention.'],
      secondaryCopy: 'Direction is also showing up. Some of the difficulty may come from the fact that the alternative is not yet clear enough to guide decisions confidently.'
    },
    strategy: {
      title: 'Strategy',
      personaContext: {
        founder: 'In the business problem you selected, the useful question may be where the system is actually breaking. Offer, acquisition, conversion, retention and the operating model can create similar surface symptoms while requiring very different responses.',
        freelancer: 'In the situation you described, several separate problems can easily collapse into "I need more clients." Positioning, demand, pricing, sales activity and conversion should be examined separately before deciding what needs to change.',
        professional: 'In your career situation, you may know broadly where you want to go while still lacking a credible route. Better information about the transition, the realistic options or the constraints may be more useful than continuing to debate the destination.'
      },
      whatThisMeans: ['You appear to have a reasonable sense of the outcome you want, while the current approach is not giving you enough evidence that it will get you there.', 'Every plan contains assumptions. A business assumes that the right people will see an offer, understand it and decide that it is worth paying for. A career plan assumes that a particular move will create the kind of work or life you expect. When those assumptions are wrong, extra effort can simply produce more activity around the same weak mechanism.', 'Your answers suggest that examining the approach itself may be more useful than increasing the amount of effort going into it.'],
      howThisMayShowUp: ['You are putting in considerable effort without seeing enough movement in the result that matters.', 'You keep addressing visible symptoms while remaining unsure where the system is actually failing.', 'You are using tactics without a clear idea of which assumption each tactic is testing.', 'Important decisions are being made with relatively little real-world evidence.', 'You are busy, but it is difficult to identify which activity is creating meaningful progress.'],
      whatDeservesAttentionFirst: ['Separate the outcome from the method you are currently using to reach it.', 'Ask what would need to be true for the current approach to work, then look at which of those assumptions are supported by actual evidence. This usually gives you a much more useful question than asking what else you could add.', 'The purpose is to locate where the current map may be inaccurate before investing more effort in following it.'],
      whatToKeepInMind: ['A strategy needs enough real execution before it can be judged fairly. If you frequently replace an approach before giving it enough time to produce useful evidence, Action may be contributing more than Strategy.'],
      secondaryCopy: 'Strategy is also showing up. The current approach may contain assumptions that deserve closer examination before you invest more effort in it.'
    },
    action: {
      title: 'Action',
      personaContext: {
        founder: 'In the business situation you described, there appears to be some distance between knowing and doing. This can show up around sales, visibility, difficult decisions or staying with one direction long enough to learn from it.',
        freelancer: 'In the situation you described, you may already have enough ideas. The more useful question is whether the few activities most likely to change the business are happening often enough to generate real evidence.',
        professional: 'In your career situation, there may already be a conversation, application, piece of research or decision that would give you useful information. The difficulty appears to be turning that knowledge into movement.'
      },
      whatThisMeans: ['Your answers suggest that you already know a reasonable amount about what needs to happen, but some important actions are still not happening consistently.', 'That gap can have many causes. Sometimes the action carries a cost that planning does not: possible rejection, conflict, visibility, commitment, boredom or discovering that an idea does not work. In those situations, delay can become protective without feeling obviously like avoidance.', 'The alternatives often look productive. You refine the plan, gather more information, improve something adjacent or wait until you feel more certain. Some preparation is useful, but eventually it stops producing new information.'],
      howThisMayShowUp: ['One obvious action keeps getting postponed.', 'You prepare substantially more than the task seems to require.', 'You change approach before gathering enough evidence from the current one.', 'Less important work repeatedly takes the place of something that could materially change the situation.', 'You can explain the next step clearly, yet it continues to survive on your list.'],
      whatDeservesAttentionFirst: ['Identify the specific behaviour that is missing.', 'Make it observable. "Grow the business" is too broad. "Contact five previous prospects" can actually happen.', 'Then look at what feels costly about doing it. The answer may involve rejection, commitment, visibility or simply an unpleasant task that has become easy to avoid. Knowing what makes the action difficult gives you more useful information than another attempt to become generally more disciplined.'],
      whatToKeepInMind: ['A lack of action does not automatically mean avoidance. The next step may genuinely be unclear, the strategy may still be weak, or your current capacity may be too low to execute well. The rest of your result should help distinguish these possibilities.'],
      secondaryCopy: 'Action is also showing up. There appears to be some distance between what you already know and what is consistently happening in practice.'
    },
    self_trust: {
      title: 'Self-trust',
      personaContext: {
        founder: 'In the business situation you described, this can show up as having enough information to choose a direction while continuing to reopen it. More strategy can feel productive when the harder part is committing without knowing exactly how the decision will turn out.',
        freelancer: 'In the situation you described, this may appear around pricing, positioning, clients or visibility. You can know what you want to change and become much less certain once another person has the opportunity to reject it.',
        professional: 'In your career situation, you may already have a meaningful view of what is no longer working. The uncertainty can grow when speaking up, leaving or choosing something different creates consequences for your income, identity or other people.'
      },
      whatThisMeans: ['Your answers suggest that you may have more clarity than you consistently allow yourself to rely on.', "The difficulty seems to increase when a choice becomes consequential. Other people's opinions, the possibility of regret and the wish to make the best possible decision can make your own judgment feel less dependable.", 'At that point, gathering more information can become an attempt to find certainty rather than an attempt to learn something genuinely new. Many important business and career decisions do not offer enough evidence to remove uncertainty completely.'],
      howThisMayShowUp: ['You ask several people for advice after already having a view of your own.', 'A confident opinion from someone else can make you reopen your reasoning quickly.', 'Decisions remain mentally active long after you have made them.', 'You spend a lot of time explaining or defending choices that primarily affect you.', 'You keep searching for information that would remove the possibility of regret.'],
      whatDeservesAttentionFirst: ['Pay attention to the difference between lacking information and struggling to rely on your judgment under uncertainty.', 'Before seeking another opinion, decide what evidence could genuinely change your view. Advice is useful when it gives you new information or exposes a weak assumption. It becomes less useful when you repeatedly use it to postpone ownership of a decision.', 'A reasonable decision can still have consequences you dislike. That does not automatically make the decision wrong.'],
      whatToKeepInMind: ['Self-trust does not require ignoring expertise or becoming resistant to feedback. Outside input can materially improve a decision. The relevant question is whether it sharpens your thinking or repeatedly replaces it.'],
      secondaryCopy: "Self-trust is also showing up. Your judgment may become harder to rely on when uncertainty, consequences or other people's opinions enter the picture."
    },
    capacity: {
      title: 'Capacity',
      personaContext: {
        founder: 'In the business situation you described, you may be trying to solve an important problem while carrying too much of the business yourself. When available capacity becomes very low, both strategic thinking and consistent execution become harder.',
        freelancer: 'In the situation you described, the current way of working may be demanding more attention than you have available. That can make client work, sales and ordinary decisions feel like evidence that the entire business model is failing.',
        professional: 'In your career situation, exhaustion may be influencing how you experience the job and how certain you feel about major conclusions. The job may still need to change, but your current level of capacity is relevant evidence when deciding what kind of change is needed.'
      },
      whatThisMeans: ['Your answers suggest that your available energy and mental space may be affecting how well you can deal with the problem in front of you.', 'When capacity drops, tasks require more effort and ambiguity becomes harder to tolerate. Decisions that would normally feel manageable can become unusually heavy. Low capacity can also affect how permanent, urgent or hopeless a situation feels in the moment.', 'This matters because people often continue trying to solve the original problem while ignoring the state from which they are trying to solve it.'],
      howThisMayShowUp: ['Ordinary tasks require noticeably more effort than they used to.', 'Rest is happening without leaving you feeling particularly restored.', 'You have less patience for uncertainty or other people.', 'Work or activities you normally care about feel unusually flat.', 'You keep responding to reduced capacity by demanding more effort from yourself.'],
      whatDeservesAttentionFirst: ['Treat your current capacity as useful information when evaluating the rest of the situation.', 'Large business and career decisions may still need to be made, but it is worth asking whether you currently have enough room to think about them accurately. Reducing unnecessary demands, restoring some margin or delaying a non-urgent conclusion can sometimes change the quality of the decision considerably.', 'This does not require waiting until life is perfect. It means recognising that the condition of the decision-maker is part of the decision.'],
      whatToKeepInMind: ['Low capacity can exist alongside a bad strategy, an unhealthy environment or a genuine need for change. Improvement in energy will not automatically solve those problems. It simply gives you a better position from which to evaluate them.'],
      secondaryCopy: 'Capacity is also showing up. Part of the difficulty may be amplified by having less energy or mental room available than the situation currently requires.'
    },
    relationships_boundaries: {
      title: 'Relationships & Boundaries',
      personaContext: {
        founder: 'In the business situation you described, some of the constraint may sit in relationships as much as operations. Cofounders, employees, customers or investors can become part of a business bottleneck when necessary conversations remain unresolved.',
        freelancer: 'In the situation you described, clients may be shaping the business more than you want them to. Scope, pricing, availability and difficult conversations can gradually become business problems when expectations remain unclear.',
        professional: "In your career situation, another person's reaction may be carrying substantial weight. A manager, colleague or family member can influence the decision even when much of the consequence will ultimately be yours to live with."
      },
      whatThisMeans: ["Your answers suggest that other people's expectations or reactions may be carrying considerable weight in the situation you described.", 'You may know what you prefer and still find it difficult to act on it when another person could become disappointed, angry or uncomfortable. This can gradually shape decisions about workload, clients, colleagues, pricing, career moves and the amount of access other people have to your time.', 'Over time, repeated accommodation can create problems that look operational on the surface while much of the friction sits in the conversations that have not happened.'],
      howThisMayShowUp: ['You agree to things quickly and later wish you had responded differently.', 'Difficult conversations stay pending longer than you would like.', 'You soften what you want to say until the important part becomes unclear.', "You spend significant energy trying to prevent another person's disappointment.", 'Setting a boundary feels as though it requires a detailed justification.', 'Resentment sometimes appears after you have accommodated someone repeatedly.'],
      whatDeservesAttentionFirst: ["Separate your preference from your reaction to the other person's response.", 'You can care about how a decision affects someone while still keeping your own needs visible. The useful question is how much weight their reaction deserves in the decision rather than how to make sure they never react negatively.', 'Clearer boundaries often create some short-term discomfort. That discomfort can be part of having an honest relationship rather than evidence that the boundary was inappropriate.'],
      whatToKeepInMind: ['Other people sometimes have legitimate needs, authority or information that should influence your choices. A difficult interaction is not automatically evidence of poor boundaries. Context matters.'],
      secondaryCopy: "Relationships & Boundaries are also showing up. Other people's reactions or expectations appear to be influencing the situation enough to deserve attention."
    },
    environment: {
      title: 'Environment',
      personaContext: {
        founder: 'In the business problem you selected, some of the difficulty may sit in the market, model or structure of the company. Personal motivation has limited power when the surrounding system repeatedly produces the same constraint.',
        freelancer: 'In the situation you described, your client mix, market, pricing model or way of delivering the work may be recreating the problem. Changes in personal behaviour may help without being sufficient on their own.',
        professional: 'In your career situation, there are signs that the environment itself matters. A different manager, team, company or role could change the experience substantially, which is worth understanding before making conclusions about the entire career.'
      },
      whatThisMeans: ['Your answers suggest that the situation around you may be contributing substantially to the problem.', 'The relevant environment could include the company, manager, role, clients, market, workload, incentives or the way the work itself is structured. People can spend a great deal of effort trying to become more resilient or motivated while remaining inside a system that continues to recreate the same difficulty.', 'The fact that a problem affects you personally does not mean its main cause is personal.'],
      howThisMayShowUp: ['The problem becomes noticeably smaller when the context or the people around you change.', 'Reasonable attempts to change your own behaviour have produced limited improvement.', 'The surrounding incentives encourage behaviour that conflicts with how you want to work.', 'The role or business model repeatedly demands something that does not fit well with you.', 'Similar problems keep being recreated by the structure of the situation even when you approach them differently.'],
      whatDeservesAttentionFirst: ['Look carefully at which parts of the current situation are creating the difficulty and which of those parts can realistically change.', 'That may lead to adaptation, a negotiation, redesigning part of the work or eventually leaving the situation. The useful starting point is understanding what changes when the context changes.', 'Do not assume that every recurring difficulty requires another round of self-improvement.'],
      whatToKeepInMind: ['Environment can also become an explanation that protects us from examining our own contribution. If the same difficulty appears across very different jobs, clients or working relationships, a recurring personal pattern may also be involved.', 'The useful question is how much of the problem belongs to the environment and how much travels with you.'],
      secondaryCopy: 'Environment is also showing up. Something about the surrounding context appears to be contributing to the difficulty, so internal change alone may not fully resolve it.'
    }
  };
  return {
    version: 1,
    labels: labels,
    resultContent: resultContent
  };
}();
